# generator-documents [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> description david

## Installation

First, install [Yeoman](http://yeoman.io) and generator-documents using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-documents
```

Then generate your new project:

```bash
yo documents
```

To debug the yeoman generator follow the instructions of this thread at StackOverflow:
- http://stackoverflow.com/questions/14469515/how-to-npm-install-to-a-specified-directory

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [david](home page)


[npm-image]: https://badge.fury.io/js/generator-documents.svg
[npm-url]: https://npmjs.org/package/generator-documents
[travis-image]: https://travis-ci.org/djimenezc/generator-documents.svg?branch=master
[travis-url]: https://travis-ci.org/djimenezc/generator-documents
[daviddm-image]: https://david-dm.org/djimenezc/generator-documents.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/djimenezc/generator-documents
[coveralls-image]: https://coveralls.io/repos/djimenezc/generator-documents/badge.svg
[coveralls-url]: https://coveralls.io/r/djimenezc/generator-documents


The generator was created following the instructions found at
    - http://yeoman.io/authoring/
    - https://scotch.io/tutorials/create-a-custom-yeoman-generator-in-4-easy-steps
    

##Setting up as a node module

A generator is, at its core, a Node.js module.

First, create a folder within which you'll write your generator. This folder must be named generator-name (where name is the name of your generator). This is important, as Yeoman relies on the file system to find available generators.

Once inside your generator folder, create a package.json file. This file is a Node.js module manifest. You can generate this file by running npm init from your command line or by entering the following manually:

~~~~
{
  "name": "generator-name",
  "version": "0.1.0",
  "description": "",
  "files": [
    "app",
    "router"
  ],
  "keywords": ["yeoman-generator"],
  "dependencies": {
    "yeoman-generator": "^0.24.1"
  }
}
~~~~

The name property must be prefixed by generator-. The keywords property must contain "yeoman-generator" and the repo must have a description to be indexed by our generators page.

You should make sure you set the latest version of yeoman-generator as a dependency. You can do this by running: npm install --save yeoman-generator.

The files property must be an array of files and directories that is used by your generator.

Add other package.json properties as needed.

##Folder tree

Yeoman is deeply linked to the file system and to how you structure your directory tree. Each sub-generator is contained within its own folder.

The default generator used when you call yo name is the app generator. This must be contained within the app/ directory.

Sub-generators, used when you call yo name:subcommand, are stored in folders named exactly like the sub command.

In an example project, a directory tree could look like this:

~~~~
├───package.json
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
~~~~

If you use this second directory structure, make sure you point the files property in your package.json at the generators folder.

~~~~
{
  "files": [
    "generators/app",
    "generators/router"
  ]
}
~~~~

##Extending generator

Once you have this structure in place, it's time to write the actual generator.

Yeoman offers a base generator which you can extend to implement your own behavior. This base generator will add most of the functionalities you'd expect to ease your task.

Here's how you extend the base generator:

```
var generators = require('yeoman-generator');

module.exports = generators.Base.extend();
```

The extend method will extend the base class and allow you to provide a new prototype. This functionality comes from the Class-extend module and should be familiar if you've ever worked with Backbone.

We assign the extended generator to module.exports to make it available to the ecosystem. This is how we export modules in Node.js.

The extend method will extend the base class and allow you to provide a new prototype. This functionality comes from the Class-extend module and should be familiar if you've ever worked with Backbone.

We assign the extended generator to module.exports to make it available to the ecosystem. This is how we export modules in Node.js.

##Overwriting the constructor

Some generator methods can only be called inside the constructor function. These special methods may do things like set up important state controls and may not function outside of the constructor.

To override the generator constructor, you pass a constructor function to extend() like so:

```
module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    // Next, add your custom code
    this.option('coffee'); // This method adds support for a `--coffee` flag
  }
});
```

## Adding your own functionality

Every method added to the prototype is run once the generator is called--and usually in sequence. But, as we'll see in the next section, some special method names will trigger a specific run order.

Let's add some methods:

```
module.exports = generators.Base.extend({
  method1: function () {
    console.log('method 1 just ran');
  },
  method2: function () {
    console.log('method 2 just ran');
  }
});
```

When we run the generator later, you'll see these lines logged to the console.

Running the generator

At this point, you have a working generator. The next logical step would be to run it and see if it works.

Since you're developing the generator locally, it's not yet available as a global npm module. A global module may be created and symlinked to a local one, using npm. Here's what you'll want to do:

On the command line, from the root of your generator project (in the generator-name/ folder), type:

```
npm link
```

That will install your project dependencies and symlink a global module to your local file. After npm is done, you'll be able to call yo name and you should see the console.log, defined earlier, rendered in the terminal. Congratulations, you just built your first generator!

###Finding the project root

While running a generator, Yeoman will try to figure some things out based on the context of the folder it's running from.

Most importantly, Yeoman searches the directory tree for a .yo-rc.json file. If found, it considers the location of the file as the root of the project. Behind the scenes, Yeoman will change the current directory to the .yo-rc.json file location and run the requested generator there.

The Storage module creates the .yo-rc.json file. Calling this.config.save() from a generator for the first time will create the file.

So, if your generator is not running in your current working directory, make sure you don't have a .yo-rc.json somewhere up the directory tree.

## Where to go from here?

After reading this, you should be able to create a local generator and run it.

If this is your first time writing a generator, you should definitely read the next section on running context and the run loop. This section is vital to understanding the context in which your generator will run, and to ensure that it will compose well with other generators in the Yeoman ecosystem. The other sections of the documentation will present functionality available within the Yeoman core to help you achieve your goals.
