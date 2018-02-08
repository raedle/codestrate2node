# codestrate2node
Node environment to allow node execution from within a codestrate.

Install codestrate2node globally.
```
$> npm install -g codestrate2node
```

Execute `codestrate2node` in your command line environment to run the codestrate to node service. This will
start the service on default port 1974. The port can be specified as argument, e.g., `codestrate2node --port=1948`.

# Developers

## How to release a new version
Use the `npm version <option>` command to release a new version. It will run `npm test` before version is released
and only continues if all tests succeed. It further will create a git tag named after the new version and
push the tag to the remote repository.
<!-- Travis CI will run again all tests and deploy the new version to npmjs repository. -->

To release a new version use:

```$> npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]```

For example:

```$> npm version patch```

More details on `npm version` command at [npmjs.org](https://docs.npmjs.com/cli/version).

# License
This work is licenced under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).