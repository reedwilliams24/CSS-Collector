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
  console.log(ruleString, result);
  return result;
};

const stylePerms = (classList) => {
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

  let classStyles = [];
  classList.forEach(function(className){
    let classStyle = allStyles[`.${className}`];
    if (classStyle !== undefined) {
      classStyles = classStyles.concat((classStyle));
    }
  });

  // join class names
  let classStylePerms = stylePerms(classList);

  console.log(1, classStyles);
  classStylePerms.forEach((classStylePerm) => {
    if (allStyles[classStylePerm] !== undefined) {
      classStyles = classStyles.concat((allStyles[classStylePerm]));
    }
  });
  console.log(2, classStyles);

  let idStyle = [];
  if (allStyles[`#${id}`] !== undefined) idStyle = allStyles[`#${id}`];

  console.log(elementStyles.concat(classStyles).concat(idStyle));
});
