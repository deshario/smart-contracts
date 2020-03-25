pragma solidity ^0.6;

contract TodoList {

    uint public taskCount = 0;

    struct Task {
        uint id;
        string title;
        string author;
        bool completed;
    }

    Task[] public allTask;

    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string title, string author, bool completed);

    event TaskCompleted(uint taskId, bool completed);

    constructor() public {
        createTask("Default task","admin");
    }

    function createTask(string memory taskTitle, string memory taskAuthor) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, taskTitle, taskAuthor, false);
        allTask.push(tasks[taskCount]);
        emit TaskCreated(taskCount,taskTitle,taskAuthor,false);
    }

    function toggleCompleted(uint taskId) public {
        Task memory task = tasks[taskId];
        task.completed = !task.completed;
        tasks[taskId] = task;
        emit TaskCompleted(taskId, task.completed);
    }

}