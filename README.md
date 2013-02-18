# Kitchen Sink for titanium-backbone

I won't lie to you. There's not much to see yet. This is still VERY
early.

If you run this app from within [titanium-backbone](https://github.com/trabian/titanium-backbone), though, you'll currently see this:

![Sample App](https://raw.github.com/wiki/trabian/titanium-backbone-ks/github_app_screenshot.jpg)

Not bad considering how little code is required to create it!

### Installation

#### Install Titanium SDK

Visit the [Titanium download page](http://www.appcelerator.com/products/download/) and follow the instructions from there to download Titanium Studio (and the Titanium SDK), or clone the GitHub repository at [https://github.com/appcelerator/titanium_mobile](https://github.com/appcelerator/titanium_mobile).

#### Clone the project to your development machine:

```console
$ git clone git@github.com:trabian/titanium-backbone-ks.git
$ cd titanium-backbone-ks
```

#### Install package dependencies

```console
$ npm install
```

#### (Optional) Install titanium-backbone as a submodule

If you would like to make changes to titanium-backbone-ks and titanium-backbone, run the following:

```console
$ npm run-script develop
```

This will pull the latest titanium-backbone code as a submodule and create a link to this submodule within node_modules.

#### Run the app

```console
$ cake t:iphone:run
```
