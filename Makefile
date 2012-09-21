CHECK=\033[32m✔\033[39m

build:
	@echo "Building oxyskin..."
	@stylus --use ./node_modules/nib/lib/nib.js --out . styl/
	@echo "Compiling CSS with Stylus...               ${CHECK} Done"

watch:
	@echo "Watching css changes..."
	@stylus --use ./node_modules/nib/lib/nib.js -w --out . styl/
	