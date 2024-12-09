import { PythonShell } from 'python-shell';


PythonShell.run('src/providers/image/playground/playground.py', { pythonPath: "python3", args: ['-prompt', 'What happened in World War 2?'] }).then(messages => {
    console.log('finished');
    console.log(messages);
});