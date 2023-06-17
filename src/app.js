const express = require('express');
const _log = require('./utils')
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const configCors = require('./configCors');
const config = require('./config');
let RedisStore = require("connect-redis")(session)
const redisClient = require('../connections/redis/redis-connect')
const { driveClient, disks } = require('../connections/minio/drive-connect');
// APP EXPRESS
const app = express();
app.set('trust proxy', 1);

// 2 - Usamos Cors
app.use(cors(
    configCors.application.cors.server
));

// 4 - Configuraciones
_log.debug(`The display is in (${config.NODE_ENV})`);
const PORT = config.PORT;

// Connect minio
async function createBucket(bucketName) {
    if (disks === 'minio') {
        driveClient.bucketExists(bucketName, function (err, exists) {
            if (err) {
                return console.error('Failed to check if bucket exists ', err)
            }
            if (exists) {
                _log.ready(`server Minio is connected on: http://${config.MINIO_HOST}:${config.MINIO_PORT}`)
                _log.debug(`Bucket ${bucketName} it already exists`);
            } else {
                driveClient.makeBucket(bucketName, function (err) {
                    if (err) {
                        console.error('Failed to create bucket', err)
                    } else {
                        _log.ready(`server Minio is connected on the PORT: http://${config.MINIO_HOST}:${config.MINIO_PORT}`);
                        _log.debug(`Bucket ${bucketName} successfully created`);

                    }
                })
            }
        })
    } else if (disks === 'aws') {
        const { S3Client, ListBucketsCommand, HeadBucketCommand, CreateBucketCommand } = require("@aws-sdk/client-s3");
        const s3Client = new S3Client({
            region: config.AWS_REGION,
            credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY
            }
        });
        try {
            // Verificar si el bucket existe
            await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
            // Si el bucket existe, listar los buckets
            const data = await s3Client.send(new ListBucketsCommand({}));
            _log.ready(`The AWS S3 is connected, Buckets ${JSON.stringify(data.Buckets)} already exist`);
        } catch (err) {
            try {
                await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
                _log.ready(`The AWS S3 is connected,Bucket ${bucketName} successfully created.`);
            } catch (err) {
                console.error(`Failed to create bucket ${bucketName}: `, err);
            }
        }
    } else {
        console.info("DRIVER =>", disks);
    }
}

createBucket(config.BUCKET_NAME);

// 5 - Morgan para mostrar datos de peticiones
app.use(morgan('dev'));

// 6 - Crear una SSESSION
app.use(session({
    key: "connectionUsers",
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
    cookie: {
        expires: 4 * 60 * 60 * 1000 // =>> 4 horas
    }
}));

// 7 - Usar mensajes de sistemas y enviar al cliente
app.use(flash());

// / 8 - Global Variables - MILDEWER
app.use((req, res, next) => {
    res.locals.messageSuccess = req.flash('messageSuccess');
    res.locals.messageUpdate = req.flash('messageUpdate');
    res.locals.messageDelete = req.flash('messageDelete');
    res.locals.errorValidation = req.flash('errorValidation');
    res.locals.errorMessage = req.flash("errorMessage");
    res.locals.errorUser = req.flash("errorUser");
    res.locals.errorPassword = req.flash("errorPassword");
    next();
});

// 9 - Capturar los datos de formularios.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// 10 - Recursos Publicos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use('/style', express.static(__dirname + '/public/css'));
app.use('/image', express.static(__dirname + '/public/img'));
app.use('/scripts', express.static(__dirname + '/public/js'));
app.use('/DataTables', express.static(__dirname + '/public/lib/DataTables'));

// 11 - Establecer Motor de plantilla
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

// 12 - ROUTERS VIEWS
app.use('/', require('./routes/IndexRouter')); // PAGINA PRICIPAL
app.use('/profile', require('./routes/profile/ProfileRouter'));
app.use('/workspace', require('./routes/workspace/WorkspaceRouter'));
app.use("/workspace/partners", require("./routes/workspace/Partners.router"));
app.use("/workspace/books", require("./routes/workspace/Books.router"));

// 12.1 - ROUTERS API
app.use('/api/books', require('./routes/api/Book.router.api'))
app.use('/api/bookings', require('./routes/api/Booking.router.api'))
app.use("/api/partners", require("./routes/api/Partner.router.api"));
app.use("/api/familys", require("./routes/api/Family.router.api"));
app.use("/api/users", require("./routes/api/Users.router.api"));

// 12.2 - ROUTES AUTH
app.use('/login', require('./routes/authentication/LoginRouter'))
app.use('/logout', require('./routes/authentication/LogoutRouter'))
app.use('/reset', require('./routes/authentication/ResetRouter'))
app.use('/register', require('./routes/authentication/RegisterRouter'))

// 12.3 RUTAS QUE NO EXISTE
app.use(function (req, res) {
    res.render('error_page/404')
})

function startServer(port) {
    app.listen(port, () => {
      const host = '0.0.0.0'; // Cambia esto a tu hostname deseado si no es 0.0.0.0
      const appUrl = `http://localhost:${port}`;
  
      _log.ready(` started server on ${host}:${port}, url: ${appUrl}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        _log.warn(`Port ${port} is in use, trying ${port + 1} instead.`);
        startServer(port + 1);
      } else {
        console.error(err);
      }
    });
  }
  
startServer(PORT);
