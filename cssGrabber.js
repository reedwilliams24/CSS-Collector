const CSSGrabber = function() {
  const img = $('img');

  const style = getStyles(img);

};

const getStyles = function(element) {
  console.log('hi');
  let result = {};
  while (element !== null){
    debugger;
    const styles = element.style;
    const styleKeys = Object.keys(styles);

    for (let style of styleKeys){
      if (styles[style] !== ''){
        console.log(style, '=', styles[style]);
        if (result[style] === undefined){
          result[style] = styles[style];
        }
      }
    }
    element = element.parentElement;
  }
  debugger;
  return result;
};
