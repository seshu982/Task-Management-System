const express =
  require("express");

const Task =
  require("../models/Task");

const router =
  express.Router();


// GET TASKS

router.get(
  "/",
  async (req, res) => {

    const tasks =
      await Task.find();

    res.json(tasks);

  }
);


// ADD TASK

router.post(
  "/",
  async (req, res) => {

    const task =
      await Task.create(
        req.body
      );

    res.json(task);

  }
);


// DELETE TASK

router.delete(
  "/:id",
  async (req, res) => {

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Deleted"
    });

  }
);


// UPDATE TASK

router.put(
  "/:id",
  async (req, res) => {

    await Task.findByIdAndUpdate(

      req.params.id,

      req.body

    );

    res.json({
      message:
        "Updated"
    });

  }
);

module.exports = router;