// todo - why doesn't the carousel work?!
$(document).ready(function() {
	$("#myCarousel").swiperight(function() {
		$("#myCarousel").carousel('prev');
	});
	$("#myCarousel").swipeleft(function() {
		$("#myCarousel").carousel('next');
	});
});


$(document).ready( function(){
	
	//todo - replace with actual submit form later
	// getStoresByZip('60611');

	$('#zipcodeForm').on('submit', function(e){
		var $this = $(this);

		e.preventDefault();

		zipcode = ($(this).serialize()).replace('zipcode=','');

			//todo - zipcode validation

			$.mobile.changePage("#stores-page", {transition: "slide"});

			getStoresByZip(zipcode);

	});

	// $('#landing-page').on( 'pageinit', function(event){
	// 	$('#zipcodeForm').on('submit', function(e){
	// 		var $this = $(this);

	// 		e.preventDefault();

	// 		// alert("Inside the js controller, the data is:");
	// 	});
	// 	getStoresByZip('60611');
	// });

	$('#stores-page').bind( 'pageshow', function(event){
		// alert( "This page was just enhanced by jQuery Mobile!" );
		$('li').each(function(index){
			var storeId = $(this).attr('id');
			//storeId = '#' + storeId; // #STOREID, for example - #2648421 etc.

			$(function(){
				$('#'+storeId).on( 'tap', function(event){
					$.mobile.changePage("#listings-page", {transition: "slide"});
					getListingsByStoreId(storeId);
					getStoreById(storeId);
				});
			});

		});
	});


	$('#listings-page').bind( 'pageshow', function(event){
		$('.shoplocal-listing').each(function(index){
			var listingId = $(this).attr('id');

			$(function(){
				$('#'+listingId).on( 'tap', function(event){
					$.mobile.changePage("#offer-page", {transition: "slide"});
					//todo - load offer data
					$('#offer-store-info').replaceWith(storeCacheHtml)
					getListingById($(this).attr('id'));
				});
			});

			
		});

	});


	$('#offer-page').bind( 'pageshow', function(event){
		$('.shoplocal-store-info').replaceWith(storeCacheHtml);
		// $('#thelist').append(listingsCache);
		//todo - get the listing info, and render it on the offer page

	});

});

var storesByZipAPI = 'http://api.shoplocal.com/api/2012.2/json/getstores.aspx?campaignID=c25b6637e3324098';
var listingsByStoreIdAPI = 'http://api.shoplocal.com/api/2012.2/json/getalllistings.aspx?campaignID=c25b6637e3324098&resultset=full&sortby=3&listingindex=50&listingcount=100&listingimagewidth=75'
var storeByIdAPI = 'http://api.shoplocal.com/api/2012.2/json/getstore.aspx?campaignID=c25b6637e3324098';
var listingByIdAPI = 'http://api.shoplocal.com/api/2012.2/json/getlisting.aspx?campaignID=c25b6637e3324098'

var timeoutMax = 10000;
var storeIdCache = '';

var storeCacheHtml = '';
var listingsCache = [];


var getStoresByZip = function(zipCode){
	$.ajax({
		url: 		storesByZipAPI,
		type: 		'GET',
		data: 		'citystatezip=' + zipCode,
		dataType: 	'jsonp',
		timeout: 	timeoutMax,
		success: function(data) {

			var storesList = data['content']['collection']['data'];

			var stores = [];

			$.each(storesList, function(key, val){
				stores.push('<li id="' + val['storeid']
					+'" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r"'
					+ 'data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c shoplocal-listing">'
					+ '<div class="ui-btn-inner ui-li">'
					+ '<div class="ui-btn-text">'
					+ '<a href="#" class="ui-link-inherit">'
					+ '<div class="ui-li-heading"><h4>' + val['name'] + '</h4></div>'
					+ '<p class="ui-li-desc">' + val['address1'] + '<br>' + '(' + val['phoneareacode'] + ') ' + val['phone'] + '</p>' 
					+ '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>')
			});

			var storeUlHtml = $('<ul/>', {
				'class': 'shoplocal-store-list ui-listview ui-listview-inset ui-corner-all ui-shadow',
				'data-role': 'listview',
				'data-filter': 'true',
				'data-inset': 'true',
				'data-theme': 'c',
				html: stores.join('')
			});

			var storesHtml = $('<div/>',{'id':'store-list'}).append(storeUlHtml);

			$('#store-list').replaceWith(storesHtml);

		} 
	});
};

var getListingsByStoreId = function(storeId){
	$.ajax({
		url: 		listingsByStoreIdAPI,
		type: 		'GET',
		data: 		'storeid=' + storeId,
		dataType: 	'jsonp',
		timeout: 	timeoutMax,
		success: function(data) {
			var listingsJSON = data['content']['collection'][0]['data']
			var listings = [];
			$.each(listingsJSON, function(key, val){
				//todo - replace the hard code html later
				// var listingHtml = 					
				// $('<li/>',{'id': val['listingid']})
				// .append($('<div/>', {'class': 'ui-li-heading'})
				// 	.append($('<a/>', {'href': '#', 'class': 'ui-link-inherit'})
				// 		.append($('<img/>', {'src': val['image'], 'class': 'ui-li-thumb'}))
				// 		.append($('<p/>', {'text': val['title'], 'class': 'ui-li-desc'}))file:///Users/liliang/Documents/PlaceiqWork/repo/mc-prototype/index.html#
				// 		.append($('<p/>', {'text': val['price'], 'class': 'ui-li-desc'}))								
				// 		)
				// 	);

				// listings.push('<li id="' + val['listingid'] + '" data-corners="false" data-shadow="false" data-iconshadow="true" '
				// 	+ 'data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right '
				// 	+ 'ui-li-has-arrow ui-li ui-li-has-thumb ui-first-child ui-btn-up-c">' + listingHtml.html() + '</li>');

			listings.push('<li id="' + val['listingid']
				+'" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r"'
				+ 'data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c shoplocal-listing">'
				+ '<div class="ui-btn-inner ui-li">'
				+ '<div class="ui-btn-text">'
				+ '<a href="#" class="ui-link-inherit">'
				+ '<img src="' + val['image'] + '" class="ui-li-thumb">'
				+ '<p class="ui-li-desc">' + val['title'] + '</p>'
				+ '<p class="ui-li-desc">' + val['price'] + '</p>'
				+ '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

		});

listingsCache = listings;

var listingsUlHtml = $('<div/>', {'id': 'listings'}).append(
	$('<ul/>', {
		'class': 'shoplocal-listings-by-store ui-listview ui-listview-inset ui-corner-all ui-shadow',
		'data-role': 'listview',
		'data-inset': 'true',
		'data-theme': 'c',
		html: listings.join('')
	})
	).prepend('<form class="ui-listview-filter ui-bar-c" role="search"><div class="ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield ui-body-c"><input placeholder="Filter items..." data-type="search" class="ui-input-text ui-body-c"><a href="#" class="ui-input-clear ui-btn ui-btn-up-c ui-shadow ui-btn-corner-all ui-fullsize ui-btn-icon-notext ui-input-clear-hidden" title="clear text" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="delete" data-iconpos="notext" data-theme="c" data-mini="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">clear text</span><span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span></span></a></div></form>');
$('#listings').replaceWith(listingsUlHtml);
			// $('.shoplocal-listings-by-store').append(listings.join(''));
		}
	});
};

var getStoreById = function(storeId){
	$.ajax({
		url: 		storeByIdAPI,
		type: 		'GET',
		data: 		'storeid=' + storeId,
		dataType: 	'jsonp',
		timeout: 	timeoutMax,
		success: function(data){
			storeIdCache = storeId;
			var storeJSON = data['content']['collection']['data']
			var storeInfoHtml = $('<div/>',{'id':'store-info'})
			.append(
				$('<div/>',{'class': 'shoplocal-store-info'})
				.append(
					$('<h2/>',{'text': storeJSON['pretailername']})
					.append(
						$('<p/>',{'text': storeJSON['address1'], 'class': 'ui-li-desc'})
						.append(
							$('<p/>',{'text': storeJSON['city'] + " " + storeJSON['postalcode'], 'class': 'ui-li-desc'})
							.append(
								$('<p/>',{'text': '(' + storeJSON['phoneareacode'] + ') ' + storeJSON['phone'], 'class': 'ui-li-desc'})
								.append(
									$('<p/>',{'text': storeJSON['hours'], 'class': 'ui-li-desc'})
									)
								)))));
			
			$('#store-info').replaceWith(storeInfoHtml);
			storeCacheHtml = storeInfoHtml.html();
		}
	});
};


var getListingById = function(listingId){
	$.ajax({
		url: 		listingByIdAPI,
		type: 		'GET',
		data: 		'storeid='+storeIdCache+'&listingid='+listingId + '&&listingimagewidth=120',
		dataType: 	'jsonp',
		timeout: 	timeoutMax, 
		success: 	function(data){
			var offerJSON = data['content']['collection']['data']
			var offerInfoHtml = $('<div/>',{'id':'offer-listing-info'}).
			append($('<h2/>',{'text': offerJSON['title']})).
			append(
				$('<img/>',{'src': offerJSON['image']})
				).
			append(
				$('<div/>',{'class': 'shoplocal-offer-info'}).
				append($('<p/>',{'text': 'price: ' + offerJSON['price']})).
				append($('<a/>',{'href': 'http://www.placeiq.com', 'data-theme': 'a', 'data-role': 'button', 'class': 'ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-up-c'}).
					append($('<span/>',{'class': 'ui-btn-inner ui-btn-corner-all'}).
						append($('<span/>',{'class': 'ui-btn-text', 'text': 'View Details'}))))	
				);
			$('#offer-listing-info').replaceWith(offerInfoHtml);
		}
	});
};




	// var myScroll;

	// function loaded() {
	// 	myScroll = new iScroll('wrapper', {
	// 		snap: true,
	// 		momentum: false,
	// 		hScrollbar: false,
	// 		onScrollEnd: function () {
	// 			document.querySelector('#indicator > li.active').className = '';
	// 			document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
	// 		}
	// 	});
	// }

	// document.addEventListener('DOMContentLoaded', loaded, false);







