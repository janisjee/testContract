pragma solidity ^0.4.4;


contract TodoList {

	event TaskAdded(address indexed user, string indexed date, string indexed time, string task);

	event TaskRemoved(address indexed user, string indexed date, string indexed time, string task);

	event RemoveError(address indexed user, uint taskIndex);

	// Date Time format: YYYY/MM/DD HH:MM, example: 2018/02/05 14:45, means: February 5th, 2018 02:45 PM
	// Date format: YYYY/MM/DD, example: 2018/02/05, means: February 5th, 2018
	// Time format (24 hours): HH:MM, example: 14:45, means: 02:45 PM

	struct Task {
		string date;
		string time;
		string task;
	}

	mapping (address => Task[]) public user;

	function TodoList() { }
	
	// Date Time format: YYYY/MM/DD HH:MM, example: 2018/02/05 14:45, means: February 5th, 2018 02:45 PM
	function add(string date, string time, string task) 
		external
		returns(bool)
	{
		var todo = Task(date, time, task);
	    var list = user[msg.sender];
		list.push(todo);
		TaskAdded(msg.sender, date, time, task);
	}

	// remove from array with gap
	function remove(uint taskIndex)
		external  
		returns(bool) 
	{
		var list = user[msg.sender];

        if (list.length == 0 || taskIndex >= list.length) {
			RemoveError(msg.sender, taskIndex);
			return false;
		}

		var tmp = list[taskIndex];

        for (uint i = taskIndex; i<list.length-1; i++) {
            list[i] = list[i+1];
        }
        delete list[list.length-1];
        list.length--;

		TaskRemoved(msg.sender, tmp.date, tmp.time, tmp.task);

        return true;
    }

}
