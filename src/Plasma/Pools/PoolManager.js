export default class PoolManager {

    timed = []

    constructor() {

    }

    createTask(taskId, method, delay, classFrom) {
        if (this.isTaskExist(taskId)) {
            throw  new Error("TaskId " + taskId + " already defined")
        } else {
            let task = {
                id: taskId,
                delay: delay,
                isStopped: false,
                run: function () {
                    setTimeout(() => {
                        if (!this.isStopped) {
                            method(classFrom)
                        } else {
                            PLASMA.poolManager.removeTask(this.id)
                        }
                    }, delay)
                }
            }
            this.timed.push(task)
        }
    }

    enable(taskId, method, delay, classFrom) {
        PLASMA.poolManager.removeTask(taskId)
        PLASMA.poolManager.createTask(taskId, method, delay, classFrom)
    }

    execute(taskId) {
        let taskFinal = this.getTask(taskId)
        if (taskFinal == null) {
            throw new Error("Unable to find taskId")
        } else {
            if (!taskFinal.isStopped) {
                taskFinal.run()
            } else {
                this.removeTask(taskFinal.id)
            }
        }
    }

    removeTask(taskId) {
        let newArr = []
        let x
        for (x in this.timed) {
            let task = this.timed[x]
            if (task.id != taskId) {
                newArr.push(task)
            }
        }
        this.timed = newArr
    }

    isTaskExist(taskId) {
        let x
        for (x in this.timed) {
            let task = this.timed[x]
            if (task.id == taskId) {
                return true
            }
        }
        return false
    }

    getTask(taskId) {
        let x
        let taskFinal = null;
        for (x in this.timed) {
            let task = this.timed[x]
            if (task.id == taskId) {
                taskFinal = task
                break;
            }
        }
        return taskFinal
    }

    stopTask(taskId) {
        let task = this.getTask(taskId);
        let arr = []
        if (task == null)
        {
            return
        }
        let x
        for (x in this.timed) {
            let timedTask = this.timed[x]
            if (timedTask.id != task.id) {
                arr.push(timedTask)
            } else {
                timedTask.isStopped = true
                arr.push(timedTask)
            }
        }
        this.timed = arr
    }

    startTask(taskId) {
        let task = this.getTask(taskId);
        let arr = []
        let x
        for (x in this.timed) {
            let timedTask = this.timed[x]
            if (timedTask.id != task.id) {
                arr.push(timedTask)
            } else {
                timedTask.isStopped = false
                arr.push(timedTask)
            }
        }
        this.timed = arr
    }

    unloadAll() {
        let arr = this.timed
        let x
        let newArr = []
        for (x in arr) {
            let task = arr[x]
            task.isStopped = true
            newArr.push(task)
        }
        this.timed = newArr

    }
}