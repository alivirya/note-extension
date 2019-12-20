# Notetaker Extension
This web application was built as a make-shift todo application in a code editor format. 
It was built as a personal tool, to serve to help how I currently take down things I have to do (as I am strangely unconventional sometimes)
> This is still a work in progress

If you would like to experiment with what there is thus far follow these instructions:
```
// Install packages
npm i

//Start the server
npm run start
```
The server should now be running in localhost:3000

## Installing as an extension
This extension is unsigned and so install at your own risk!
In the case that you would like to use this application as an extension follow the steps below:
These instructions are only for firefox as that is my browser of choice!

* Run `npm i` and `npm run build`
* Go to about:addons

### As a temporary add-on
* Select debug addons from the preferences menu
* Click load a temporary add on
* Load the `manifest.json` file in the `build` directory

### As a permanent add-on
* Install [web-ext](https://github.com/mozilla/web-ext) by running `npm install -g web-ext` unless you would like to install it exclusively for your project, in which case run `npm install --save-dev web-ext`
* Go to the build folder, and run `web-ext build`
* Go to about:config and set xpinstall.signatures.required to false (again, do at your own discretion)
* Choose `install Add-On from file` and choose the file `build/web-ext-artifacts/notetaker_tab-1.0.0.zip`
* The notetaker extension will be called "Notetaker tab", in order to make sure that it stays in your browser go to options, and click "manage"
* Turn off automatic updates

The notetaker extension should now be installed and be able to used from a new tab :-)  

Thanks!
