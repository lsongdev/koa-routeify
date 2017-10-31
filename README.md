## koa-routeify ![npm](https://badge.fury.io/js/koa-routeify.png)

the next router for koajs.

[![NPM](https://nodei.co/npm/koa-routeify.png?months=1&downloads=true&downloadRank=true&stars=true)](https://npmjs.org/koa-routeify)

### Installation

````
$ npm install koa-routeify --save
````

> If you use `koa` v1.x, please install `koa-routeify` v1.x too.

### Example

app.js

````javascript
import koa      from 'koa';
import routeify from 'koa-routeify';

const app = koa();

app.use(routeify(app));

app.listen(3000);
````
routes/route.js

```javascript
get /:name => home#index
```

controllers/home.js

```javascript
class Home {
  index(name){
    this.ctx.body = `Hello ${ name || 'World' }!`;
  }
}
```

### API
check this file: `index.js`

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2015 lsong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
