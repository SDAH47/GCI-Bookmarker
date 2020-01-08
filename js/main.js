window.onload = function() {
	if( localStorage.getItem( "bookmarks" ) == null ) 
		localStorage.setItem( "bookmarks", "[]" );
		
	document.querySelector( "div.modal-content form" ).onsubmit = function( event ) {
		event.preventDefault();
		
		var siteUrl = this.querySelector( "input.url" ).value,
			name = this.querySelector( "input.s-name" ).value;
		
		if( !validateForm( name, siteUrl ) ) 
			return false;
			
		var bookmark = {
			url: siteUrl,
			name: name
		}
		
		var bookmarks = JSON.parse( localStorage.getItem( "bookmarks" ) );
		bookmarks.push( bookmark );
			
		localStorage.setItem( "bookmarks", JSON.stringify( bookmarks ) );
		
		this.parentNode.parentNode.style.display = "none";
		
		fetchBookmarks();
	};
	
	fetchBookmarks();
	
	// Showing the model.
	
	var add = document.querySelector( "button.add" ),
		modal = document.querySelector( "div.modal" ),
		cancel = document.querySelector( "input.cancel" );
	
	add.onclick = function() {
		modal.style.display = "block";
	};
	
	cancel.onclick = function() {
		modal.style.display = "none";
	};
	
	window.onclick = function( event ) {
		if( event.target === modal ) 
			modal.style.display = "none";
	}
};

function fetchBookmarks() {
	var string = "";
	JSON.parse( localStorage.getItem( "bookmarks" ) ).forEach( function( bm ) {
		string += '<div class= "bm"><div class= "name"><a href= "' + bm.url + '" target= "_blank">' + bm.name + '</a></div><div class= "menu-holder"><div class= "menu"></div><div class= "menu-content"><ul><li onclick= "window.open(\'' + bm.url + '\')">Visit</li><li onclick= "deleteBM(\'' + bm.url + '\')">Delete</li></ul></div></div></div>'
	} );
	
	document.querySelector( "div.bookmarks" ).innerHTML = string || "<div class= \"nbmf\">No bookmarks found!</div>";
	handleMenues();
}

function handleMenues() {
	var menus = document.querySelectorAll( "div.menu" );
	
	[].slice.call( menus ).forEach( function( menu ) {
		menu.onclick = function() {
			[].slice.call( document.querySelectorAll( "div.menu-content" ) ).forEach( function( elem ) {
				elem.style.display = "none";
			} );
			
			var m_content = this.parentNode.querySelector( "div.menu-content" );
			if( !this.classList.contains( "clicked" ) ) {
				this.classList.add( "clicked" );
				m_content.style.display = "block";
			} else {
				this.classList.remove( "clicked" );
				m_content.style.display = "none";
			}
		};
	} );
}

function deleteBM( url ) {
	var bookmarks = JSON.parse( localStorage.getItem( "bookmarks" ) ), i = 0;
	
	for( ; i < bookmarks.length; i++ ) {
		if( bookmarks[ i ].url === url ) 
			bookmarks.splice( i, 1 );
	}
	
	localStorage.setItem( "bookmarks", JSON.stringify( bookmarks ) );
	fetchBookmarks();
}

function validateForm(siteName, siteUrl){
	if(!siteName || !siteUrl) {
		alert( "Please fill in the form." );
		return false;
	}

	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex = new RegExp(expression);

	if(!siteUrl.match(regex)) {
		alert( "Please use a valid URL" );
		return false;
	}

	return true;
}