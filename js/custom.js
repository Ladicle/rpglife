$(function(){
    var cocoa = new MilkCocoa("eggif2s5l6n.mlkcca.com");
    var pageStore = cocoa.dataStore('page');
    var pageElems = $("article")
    var pageNum = pageElems.length;
    var pageInfo;

    // Render article background color depend on likeRate
    function renderLikeRate(pageIndex) {
	if(!pageInfo) {
	    return;
	}

	// white -> yellow -> red
	var likeRate = pageInfo[pageIndex].value.like;
	var blue = Math.max(255 - likeRate, 148);
	var yellow = Math.max(0, 403 - Math.max(likeRate, 148));
	var color = "rgb(255," + yellow + "," + blue +")";
	
	pageElems.eq(pageIndex).css("background-color", color);
    }

    // Load like number
    pageStore.stream().size(pageNum).sort('asc').next(function(
	err, pages) {
	pageInfo = pages;
	$.each(pages, function(index, page) {
	    if(page.value != null){
		renderLikeRate(page.value.index);
	    }
	});
    });

    // Observe set event
    pageStore.on('set', function(page) {
	renderLikeRate(page.value.index);
    });

    // Click dokan and update like rate.
    $(".dokan").click(function() {
	// Setup animation
	var el = $(".current .likeButton");
	var newone = el.clone(true);
	el.before(newone);
	el.remove();

	// Get current page infomation
	if(!pageInfo) {
	    return;
	}
	
	var currentPageIndex = $(".current").index("article");
	var currentPageInfo = pageInfo[currentPageIndex];

	// Update like rate
	++currentPageInfo.value.like;
	pageStore.set(currentPageInfo.id, currentPageInfo.value, function(err, set){
	    if(err) {
		console.error(err);
	    }
	}, function(err) {
	    console.error(err);
	});
    });
});
