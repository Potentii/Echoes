# Echoes
> Echoes is a web chat application made with node.js
>
> This project has academic/study purposes only, so is not recommended to use it on other scenarios.



## Running
You should have `Node.js` installed on your machine before trying to run this project.

It also needs you to have a `MySQL` instance running on `port:3306` with `user:root, password:root`.
- Run all sql scripts on 'server-app > sql' directory to setup the database.
- Go to 'server-app' directory inside this project, and install all dependencies:
```sh
$ npm install
```
- After that, execute the `start` script:
```sh
$ npm start
```
- It will start the server, so you can now access the application with the following URL on your browser:
```
http://localhost:3000/echoes
```



## Building
In order to build the server as a Windows x64 application, just run the `build` script:
```sh
$ npm run build
```
More info on electron-packager's build script you should see [here](https://github.com/electron-userland/electron-packager/blob/master/usage.txt) or by simply running `electron-packager --help`


## Dependencies
- [Electron](http://electron.atom.io/)
- [Socket.io](http://socket.io/)
- [Express](http://expressjs.com/)
- [MySQL](https://github.com/felixge/node-mysql)
- [jQuery](https://jquery.com/)
- [electron-packager](https://github.com/electron-userland/electron-packager)
- [body-parser](https://github.com/expressjs/body-parser)
- [internal-ip](https://github.com/sindresorhus/internal-ip)



## Author
**Guilherme Reginaldo Ruella**
- [Github](https://github.com/Potentii/)



## License
Copyright (c) 2016 Guilherme Reginaldo Ruella (potentii@gmail.com)

>MIT License
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
