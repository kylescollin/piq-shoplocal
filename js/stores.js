$(document).ready( function(){

	getStoresByZip('60611');

	$('#stores-page').on( 'pageinit', function(event){
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


	$('#listings-page').on( 'pageshow', function(event){
		$('.shoplocal-listing').each(function(index){
			var listingId = $(this).attr('id');

			$(function(){
				$('#'+listingId).on( 'tap', function(event){
					$.mobile.changePage("#offer-page", {transition: "slide"});
					//todo - load offer data
					$('#offer-store-info').replaceWith(storeCache)
				});
			});

			
		});

	});


});

var storesByZipAPI = 'http://api.shoplocal.com/api/2012.2/json/getstores.aspx?campaignID=c25b6637e3324098';
var listingsByStoreIdAPI = 'http://api.shoplocal.com/api/2012.2/json/getalllistings.aspx?campaignID=c25b6637e3324098&resultset=full&sortby=3&listingindex=153&listingcount=100&listingimagewidth=75'
var storeByIdAPI = 'http://api.shoplocal.com/api/2012.2/json/getstore.aspx?campaignID=c25b6637e3324098';

var storeCache = '';
var listingsCache = [];


var getStoresByZip = function(zipCode){
	$.ajax({
		url: 		storesByZipAPI,
		type: 		'GET',
		data: 		'citystatezip=' + zipCode,
		dataType: 	'jsonp',
		timeout: 	10000,
		success: function(data) {

			var storesList = data['content']['collection']['data'];

			var stores = [];

			$.each(storesList, function(key, val){
				stores.push('<li id="' + val['storeid'] + '"><a href="#"><div class="ui-li-heading"><h4>' + val['name'] + '</h4></div>'
					+ '<p class="ui-li-desc">' + val['address1'] + '<br>' + '(' + val['phoneareacode'] + ') ' + val['phone'] + '</p></a></li>');
			});

			$('<ul/>', {
				'class': 'shoplocal-store-list ui-listview ui-listview-inset ui-corner-all ui-shadow',
				'data-role': 'listview',
				'data-inset': 'true',
				'data-theme': 'c',
				html: stores.join('')
			}).appendTo('#store-list');

		} 
	});
};

var getListingsByStoreId = function(storeId){
	$.ajax({
		url: 		listingsByStoreIdAPI,
		type: 		'GET',
		data: 		'storeid=' + storeId,
		dataType: 	'jsonp',
		timeout: 	10000,
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
				// 		.append($('<p/>', {'text': val['title'], 'class': 'ui-li-desc'}))
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
				);
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
		timeout: 	10000,
		success: function(data){
			var storeJSON = data['content']['collection']['data']
			var storeInfoHtml = $('<div/>',{'id':'store-info'})
			.append(
				$('<div/>',{'class': 'shoplocal-store-info ui-content'}))
			.append(
				$('<h4/>',{'text': storeJSON['pretailername']}))
			.append(
				$('<p/>',{'text': storeJSON['address1']}))
			.append(
				$('<p/>',{'text': storeJSON['city'] + " " + storeJSON['postalcode']}))
			.append(
				$('<p/>',{'text': '(' + storeJSON['phoneareacode'] + ') ' + storeJSON['phone']}))
			.append(
				$('<p/>',{'text': storeJSON['hours']}));
			
			$('#store-info').replaceWith(storeInfoHtml);
			storeCache = storeInfoHtml.html();
		}
	});
};













