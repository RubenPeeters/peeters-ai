.PHONY: install check
install:
	pnpm install --frozen-lockfile
check: install
	pnpm astro check
	pnpm build
