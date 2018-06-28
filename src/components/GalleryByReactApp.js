'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');

//only need imageURL  获取图片相关数据
var imageDatas = require('../data/imageData.json');

//利用自执行函数，将图片信息转化为图片URL路径信息
function generateImageURL(imageDataArr){
    for(var i = 0; i < imageDataArr.length; i++){
        var singleImageData = imageDataArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
}
imageDatas = generateImageURL(imageDatas);
var GalleryByReactApp = React.createClass({
  render: function() {
    return (
      <section className="stage">
          <section className="img-sec"></section>
          <nav className='controller-nav'></nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
