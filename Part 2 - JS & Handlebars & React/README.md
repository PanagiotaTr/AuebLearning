# Welcome to Aueb Learning

Welcome to **Aueb Learning**, your comprehensive platform for enhancing your programming skills and knowledge. This README file will guide you on how to run Node.js files with and without arguments, along with some user credentials for demonstration purposes.

## Running a Node.js File

You can run a Node.js file in two different ways:

### 1. Running Without Arguments
To execute a Node.js file without any arguments, use the following command:
```bash
node filename.js
```
**Example:**
```bash
node app.js
```
This will run the `app.js` file without any additional parameters.

### 2. Running With Arguments
You can pass arguments to a Node.js file by specifying them after the file name.
```bash
node filename.js arg1 arg2
```
**Example:**
```bash
node app.js 123 hello
```
In this example, `123` and `hello` are arguments passed to the `app.js` script. You can access these arguments inside your script using `process.argv`.

```javascript
// Example app.js
console.log('Arguments:', process.argv.slice(2));
```
Running `node app.js 123 hello` will output:
```
Arguments: [ '123', 'hello' ]
```

## User Credentials (Sample)
Here are some sample user credentials for demonstration purposes:

| Username | Password  | Role         |
|----------|-----------|--------------|
| user1    | pass123   | student      |
| admin    | adminPass | administrator |
| guest    | guest123  | guest        |

> **Note:** These are dummy credentials. Replace them with your actual user management system.

## Conclusion
We hope this guide helps you get started with running Node.js files and understanding basic usage. Happy coding!

