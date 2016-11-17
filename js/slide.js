/**
 * Created by doden on 2016.11.01.
 */

var louver = (function () {

    var images = new Array();
    var urls = new Array();
    var blinds = null;

    var defaultOptions = {
        numberOfBlinds:10,//叶片数
        slideVisibleTime:5000,//图片切换时间
        color:"#ffffff",//切割的空隙颜色
        margin:2,//外边距
        width:960,//容器宽度
        height:600,//容器高度
        gap:100,//切割间隙
        animationSpeed:300,//动画过渡时间
        hasLink : false,//是否有链接
        orientation:'vertical'//叶片方向数组
    };

    var options = {};
    var li = document.getElementsByTagName("li");

    function doSlide() {
        var element = document.getElementById("slide");
        var userOptions = arguments[0];

        //合并对象
        options = $.extend(defaultOptions,userOptions);

        addImageArray();
        images[0].classList.add('active');

        //添加class
        addImageClass(element);

        setSpanStyle(element);
        blinds = element.getElementsByTagName('span');

        var isDown = false;
        var enterTop,exitTop;

        $("#slide").mousedown(function (e) {
            if(options.orientation == 'vertical'||options.orientation== 'up'||options.orientation=='down'){
                enterTop = e.pageY;
            }else if(options.orientation == 'horizontal'||options.orientation== 'left'||options.orientation=='right'){
                enterTop = e.pageX;
            }
            isDown = true;
        }).mouseup(function (e) {
            var type = [];
            if(options.orientation == 'vertical'||options.orientation== 'up'||options.orientation=='down'){
                exitTop = e.pageY;
            }else if(options.orientation == 'horizontal'||options.orientation== 'left'||options.orientation=='right'){
                exitTop = e.pageX;
            }

            if(isDown){
                if(exitTop-enterTop>10){
                    closeWindow(element);

                    setTimeout(function () {
                        changeImg(element,'right');
                        openWindow(element);
                    },options.animationSpeed);
                }else if(exitTop-enterTop<-10){
                    closeWindow(element);

                    setTimeout(function () {
                        changeImg(element,'top');
                        openWindow(element);
                    },options.animationSpeed);
                }
            }
            isDown = false;
        }).mouseover(function () {
            clearInterval(exchangeImage);
        }).mouseout(function () {
            exchangeImage = setInterval(function () {
                closeWindow(element);

                setTimeout(function () {
                    changeImg(element,type);
                    openWindow(element);
                },options.animationSpeed);
            },options.slideVisibleTime);
        });

        setAnimation(element,'right');
    }


    var exchangeImage;


    //设置过渡动画
    function setAnimation(element,type){
        exchangeImage = setInterval(function () {
            closeWindow(element);

            setTimeout(function () {
                changeImg(element,type);
                openWindow(element);
            },options.animationSpeed);

        },options.slideVisibleTime);
    }
    //设置图片样式
    function addImageClass(element) {
        element.classList.add('louver');
        element.style.width = options.width+"px";
        element.style.height = options.height+"px";
        var img = element.getElementsByTagName('img');
        for(let i=0;i<img.length;i++){
            img[i].style.width = options.width +"px";
            img[i].style.height = options.height + "px";
        }
    }
    //添加图像数组
    function addImageArray() {
        for(let i=0;i<li.length;i++){
            var el = li[i];
            if(options.hasLink||el.getElementsByTagName("a")[0]){
                options.hasLink = true;
                urls.push(el.getElementsByTagName("a")[0].href);
            }
            images.push(el);
        }
    }
    //计算切割span的边框
    function calculateBorders() {
        var random = Math.floor(Math.random()*9+1)
        var borderWidthTop = (random/10)*options.gap;
        var borderWidthBottom = options.gap - borderWidthTop;

        return {borderWidthTop:borderWidthTop,borderWidthBottom:borderWidthBottom};
    }
    //设置切割样式
    function setSpanStyle(element) {
        var spanWidth = 0;
        var spanHeight = 0;

        if(options.orientation === 'vertical'||options.orientation === 'down'||options.orientation === 'up'){
            //垂直叶片：切割宽度
            spanWidth = options.width / options.numberOfBlinds;
        }else if(options.orientation === 'horizontal'||options.orientation === 'left'||options.orientation === 'right'){
            //水平叶片：切割高度
            spanHeight = options.height / options.numberOfBlinds;
        }else{
            alert("参数有误！")
        }

        for(let i=0;i<options.numberOfBlinds;i++){
            var el = document.createElement("span");
            var borders = calculateBorders();

            if(options.orientation === 'vertical'){
                el.style.left = i*spanWidth +"px";
                el.style.height = options.height +"px";
                el.style.width = spanWidth +"px";
                el.style.border = options.margin+"px solid "+options.oolor;
                el.style.borderTop = borders.borderWidthTop+"px solid "+options.color;
                el.style.borderBottom = borders.borderWidthBottom+"px solid "+options.color;
                el.style.borderRight = spanWidth / 20 +"px solid "+options.color;
            }else if(options.orientation === 'horizontal'){
                el.style.top = i*spanHeight +"px";
                el.style.height =spanHeight +"px";
                el.style.width = options.width +"px";
                el.style.border = options.margin+"px solid "+options.oolor;
                el.style.borderRight = borders.borderWidthTop+"px solid "+options.color;
                el.style.borderLeft = borders.borderWidthBottom+"px solid "+options.color;
                el.style.borderBottom = spanHeight / 10 +"px solid "+options.color;
            }else if(options.orientation === 'down'){
                el.style.left = i*spanWidth +"px";
                el.style.height = options.height +"px";
                el.style.width = spanWidth +"px";
                el.style.border = options.margin+"px solid "+options.oolor;
                el.style.borderTop = borders.borderWidthTop*2+"px solid "+options.color;
                el.style.borderRight = spanWidth / 20 +"px solid "+options.color;
            }else if(options.orientation === 'up'){
                el.style.left = i*spanWidth +"px";
                el.style.height = options.height +"px";
                el.style.width = spanWidth +"px";
                el.style.border = options.margin+"px solid "+options.oolor;
                el.style.borderBottom = borders.borderWidthBottom*2+"px solid "+options.color;
                el.style.borderRight = spanWidth / 20 +"px solid "+options.color;
            }else if(options.orientation === 'left'){
                el.style.top = i*spanHeight +"px";
                el.style.height =spanHeight +"px";
                el.style.width = options.width +"px";
                el.style.border = options.margin+"px solid "+options.oolor;
                el.style.borderRight = borders.borderWidthTop*2+"px solid "+options.color;
                el.style.borderBottom = spanHeight / 10 +"px solid "+options.color;
            }else if(options.orientation === 'right'){
                el.style.top = i*spanHeight +"px";
                el.style.height =spanHeight +"px";
                el.style.width = options.width +"px";
                el.style.border = options.margin+"px solid "+options.oolor;
                el.style.borderLeft = borders.borderWidthBottom*2+"px solid "+options.color;
                el.style.borderBottom = spanHeight / 10 +"px solid "+options.color;
            }

            element.insertBefore(el,element.getElementsByTagName("ul")[0]);
        }
    }
    //切换图片
    function changeImg(element,type) {

        var ul = element.getElementsByTagName("ul")[0];
        for(let i=0;i<ul.children.length;i++){
            if(ul.children[i].className == 'active'){

                if(type=='right'){
                    if(i==ul.children.length-1){
                        ul.children[i].classList.remove('active');
                        i = 0;
                        ul.children[i].classList.add('active');
                        break;
                    }
                    ul.children[i].classList.remove('active');
                    ul.children[i+1].classList.add('active');
                    break;
                }else if(type =='top'){
                    if(i==0){
                        ul.children[i].classList.remove('active');
                        i = ul.children.length-1;
                        ul.children[i].classList.add('active');
                        break;
                    }
                    ul.children[i].classList.remove('active');
                    ul.children[i-1].classList.add('active');
                    break;
                }

            }




        }
    }
    //关闭窗
    function closeWindow(element) {
        var spans = element.getElementsByTagName("span");

        for(let i=0;i<spans.length;i++){
            if(options.orientation === 'vertical'){
                spans[i].style.borderTop = options.height+"px solid "+options.color;
                spans[i].style.borderBottom = options.height+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'horizontal'){
                spans[i].style.borderLeft = options.width+"px solid "+options.color;
                spans[i].style.borderRight = options.width+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'down'){
                spans[i].style.borderTop = options.height+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'up'){
                spans[i].style.borderBottom = options.height+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'left'){
                spans[i].style.borderRight = options.width+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'right'){
                spans[i].style.borderLeft = options.width+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }
        }
    }
    //打开窗
    function openWindow(element) {
        var spans = element.getElementsByTagName("span");

        for(let i=0;i<spans.length;i++){
            var borders = calculateBorders();
            if(options.orientation === 'vertical'){
                spans[i].style.borderTop = borders.borderWidthTop+"px solid "+options.color;
                spans[i].style.borderBottom = borders.borderWidthBottom+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'horizontal'){
                spans[i].style.borderLeft = borders.borderWidthBottom+"px solid "+options.color;
                spans[i].style.borderRight = borders.borderWidthTop+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'down'){
                spans[i].style.borderTop = borders.borderWidthTop*2+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'up'){
                spans[i].style.borderBottom = borders.borderWidthBottom*2+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'left'){
                spans[i].style.borderRight = borders.borderWidthTop*2+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }else if(options.orientation === 'right'){
                spans[i].style.borderLeft = borders.borderWidthBottom*2+"px solid "+options.color;
                spans[i].style.transition = "border "+options.animationSpeed/1000+"s linear";
            }
        }
    }

    return {slide:doSlide};
})();