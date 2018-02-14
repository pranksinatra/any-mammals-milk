<nav>
	<a id="site-title" href="/">
		<svg id="bottle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M363 182v-11c0-21-16-39-36-42-7-18-20-27-29-35-4-2-10-7-10-9 0-6 2-10 4-14 3-6 6-13 7-25 1-21-12-40-32-45a43 43 0 0 0-54 42c0 13 4 21 7 27 2 5 4 9 4 15 0 2-6 7-10 9-9 8-22 17-29 35-20 3-36 21-36 42v11a53 53 0 0 0-21 42v235c0 29 24 53 53 53h150c29 0 53-24 53-53V224c0-17-8-33-21-42zm-136-71c9-6 18-13 18-26 0-11-3-18-6-24-2-5-4-10-4-18a21 21 0 0 1 27-21c9 3 16 12 15 23 0 8-2 11-4 16-3 6-6 13-6 24 0 13 9 20 18 26 6 5 12 10 17 17h-92c5-7 11-12 17-17zm-56 60c0-12 9-22 21-22h128c12 0 21 10 21 22v1l-10-1H181l-10 1v-1zm192 288c0 17-15 32-32 32H181c-17 0-32-15-32-32v-11h54a11 11 0 0 0 0-21h-54v-43h32a11 11 0 0 0 0-21h-32v-43h54a11 11 0 0 0 0-21h-54v-43h32a11 11 0 0 0 0-21h-32v-11c0-18 15-32 32-32h150c17 0 32 14 32 32v235z"/></svg>
		Any mammal's milk
	</a>
	<ul>
		<li><a class="{{page === "index"  ? "selected" : ""}}" href="/">
			<svg id="swipe-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 397"><path d="M287 222a32 32 0 0 0-34-26l49-50c13-13 13-33 0-45a32 32 0 0 0-45 0L150 208v-16a64 64 0 0 0-53-62c-6 0-11 5-11 11v155a104 104 0 0 0 177 71l37-37c8-9 11-20 8-31l-21-77zm1 96l-37 38a88 88 0 0 1-149-60V147a48 48 0 0 1 32 45v30c0 3 1 5 4 6 6 3 13 2 17-3l113-113a16 16 0 0 1 23 23l-66 65a8 8 0 0 0 7 14l22-2c3-1 9-1 13 4 3 3 4 6 5 9l20 78c2 6 0 11-4 15zM181 0l-11 11 29 29h-81v16h81l-29 29 11 11 49-48z"/></svg>
			Swipe
		</a></li>
		<li><a class='{{page === "browse"  ? "selected" : ""}}' href='/browse'>
			<svg id="binoculars-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M102 300c-25 0-47 15-56 38a11 11 0 0 0 20 8c6-15 20-25 36-25a11 11 0 0 0 0-21zm154-50a40 40 0 1 0 0 80 40 40 0 0 0 0-80zm0 59a19 19 0 1 1 0-37 19 19 0 0 1 0 37z"/><path d="M504 319l-44-145c-6-20-13-45-30-62a61 61 0 1 0-118 22 999 999 0 0 0-12 14 71 71 0 0 0-88 0 1336 1336 0 0 1-12-14 61 61 0 0 0-57-83c-34 0-61 28-61 61-17 17-24 42-30 62L8 319a102 102 0 1 0 196 45 97 97 0 0 0 104 0 102 102 0 1 0 196-45zM369 73c17 0 31 10 37 25-7-2-14-4-23-4-21 0-38 10-53 23a39 39 0 0 1 39-44zm-226 0a40 40 0 0 1 39 44 80 80 0 0 0-53-23c-9 0-16 2-23 4 6-15 20-25 37-25zm-41 366a81 81 0 1 1 0-161 81 81 0 0 1 0 161zm154-81c-21 0-41-8-55-24a102 102 0 0 0-158-59l29-95c11-38 22-64 57-64 25 0 44 20 62 40l10 10-7 45a11 11 0 0 0 21 3l7-46a50 50 0 0 1 68 0l3 21a11 11 0 0 0 21-3l-3-20 10-10c18-20 37-40 62-40 35 0 46 26 57 64l29 95c-17-11-37-18-59-18-48 0-88 33-99 77a76 76 0 0 1-55 24zm154 81a81 81 0 1 1 0-161 81 81 0 0 1 0 161z"/><path d="M65 368a11 11 0 0 0-20 6 11 11 0 1 0 20-6zm345-68c-25 0-47 15-55 38a11 11 0 0 0 20 8c5-15 19-25 35-25a11 11 0 0 0 0-21zm-36 68a11 11 0 0 0-21 6 11 11 0 1 0 21-6z"/></svg>
			Browse
		</a></li>
	</ul>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;

		border-bottom: 1px solid rgba(170,30,30,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	/* Tiny screens */
	@media (max-width: 370px) {
		#swipe-icon, #binoculars-icon { display: none; }
	}

	/* Small screens */
	@media (max-width: 425px) {
		nav { font-size: 14px; padding: 0 .5em; }
	}

	svg {
		width: 1.5rem;
		display: inline-block;
		vertical-align: middle;
		margin-top: -6px;
	}

	#site-title {
		font-size: inherit;
		line-height: 3.5;
		margin-bottom: 0;
		font-weight: 300;
		padding: 0;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	li {
		display: block;
		float: left;
	}

	#binoculars-icon {
		padding: 0 4px;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(170,30,30);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>