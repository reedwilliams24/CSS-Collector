const getAllStyles = function(){
  let result = {};

  const sheets = document.styleSheets;

  for (let sheet of sheets){
    const rules = sheet.cssRules;
    for (let rule of rules){
      result[rule.selectorText] = parseRule(rule.cssText);
    }
  }

  return result;
};

const parseRule = function(ruleString){
  const begIdx = ruleString.indexOf('{');
  const endIdx = ruleString.indexOf('}');

  let rules = ruleString.slice(begIdx+1, endIdx).trim().split(';').map((rule)=>{
    return rule.trim();
  });
  let result = [];

  for (let rule of rules){
    if (rule.length > 0){
      result.push(rule.concat(';'));
    }
  }
  return result;
};

const stylePerms = (classList) => {
  if (classList.length === 0) return [];
  if (classList.length === 1) return [`.${classList[0]}`];

  const otherPerms = stylePerms(classList.slice(1));
  let newPerms = otherPerms.map((perm) => `.${classList[0]}${perm}`);

  return newPerms.concat(otherPerms).concat([`.${classList[0]}`]);
};

getAllStyles();

document.addEventListener('click', function(e){
  const allStyles = getAllStyles();
  const tagName = e.target.tagName.toLowerCase();
  let classList = [];
  e.target.classList.forEach((el) => {
    classList.push(el);
  });
  const id = e.target.id;

  let result = {};

  let elementStyles = [];
  if (allStyles[tagName] !== undefined) elementStyles = allStyles[tagName];

  elementStyles.forEach((elStyle) => {
    elStyle = elStyle.split(':');
    result[elStyle[0]] = elStyle[1].trim();
  });

  let classStyles = [];
  classList.forEach(function(className){
    let classStyle = allStyles[`.${className}`];
    if (classStyle !== undefined) {
      classStyles = classStyles.concat((classStyle));

      // refactor
      classStyle.forEach((style) => {
        style = style.split(':');
        result[style[0]] = style[1].trim();
      });
    }
  });

  // join class names
  let classStylePerms = stylePerms(classList).map((stylePerm) => {
    if (stylePerm.split('.').length > 2) {
      return stylePerm;
    } else {
      return '';
    }
  });

  classStylePerms.forEach((classStylePerm) => {
    if (allStyles[classStylePerm] !== undefined) {
      classStyles = classStyles.concat((allStyles[classStylePerm]));

      // refactor
      classStyles.forEach((style) => {
        style = style.split(':');
        result[style[0]] = style[1].trim();
      });
    }
  });

  let idStyles = [];
  if (allStyles[`#${id}`] !== undefined) idStyles = allStyles[`#${id}`];

  idStyles.forEach((idStyle) => {
    idStyle = idStyle.split(':');
    result[idStyle[0]] = idStyle[1].trim();
  });

  console.log(elementStyles.concat(classStyles).concat(idStyles));
  console.log(result);
  console.log(e.target);
});


// TODO need to add ranking system
// ex: clicking on a flag on minesweeper does not grab the green background
