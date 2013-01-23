CHECK=\033[32m✔\033[39m

build:
	@echo "Building oxyskin..."
	@echo "Installing node packages"
	@npm install
	@echo "Node package install...                    ${CHECK} Done"
	 @stylus --use ./node_modules/nib/lib/nib.js --out . styl/
	@echo "Compiling CSS with Stylus...               ${CHECK} Done"
	@echo "Building sprite..."
	@node sprite.js
	@echo "Image sprite...                            ${CHECK} Done"
	

watch:
	@echo "Watching css changes..."
	@stylus --use ./node_modules/nib/lib/nib.js -w --out . styl/
	
