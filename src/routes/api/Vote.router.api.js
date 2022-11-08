const express = require("express");
const connection = require("../../../database/db");
const routerVotes = express.Router();

routerVotes.get("/", async (req, res) => {
	await connection.query("SELECT * FROM votes", function(err, results) {
	  if (err) {
		return res.status(404).send(err);
	  }
    if (results.length === 0){
      return res.status(404).send(`No data found for that votes`);
    }
	  res.send(JSON.stringify({data:results}));
	});
  });

routerVotes.get("/:id_vote", async (req, res) => {
  const id_vote = req.params.id_vote;
  var sql = "SELECT * FROM votes WHERE id_vote=?"
	await connection.query(sql, [id_vote], function(err, results) {
	  if (err) {
		  return res.status(404).send(err);
	  }
    if (results.length === 0){
      return res.status(404).send(`No data found for that booking id ${id_vote}`);
    }
	  res.send(JSON.stringify({data:results}));
	});
});

module.exports = routerVotes;