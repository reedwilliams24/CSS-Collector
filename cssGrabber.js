const getCSSRules = () => {
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

const parseRule = (str) => {
  const begIdx = str.indexOf('{');
  const endIdx = str.indexOf('}');
  let result = [];

  const rules = str.slice(begIdx+1, endIdx).trim().split(';').map((rule)=>{
    return rule.trim();
  }).filter(el => el!=='');

  rules.forEach((rule) => {
    result.push(`${rule};`);
  });

  return result;
};

var permutations = (arr) => {
  if (arr.length === 0) return [[]];
  if (arr.length === 1) return [arr];

  let result = [[arr[0]]];
  const otherPerms = permutations(arr.slice(1));

  otherPerms.forEach((otherPerm) => {
    let idx = 0;
    result.push(otherPerm);
    while (idx <= otherPerm.length){
      result.push(
        otherPerm.slice(0,idx).concat([arr[0]]).concat(otherPerm.slice(idx)));
      idx += 1;
    }
  });

  return result;
};

document.addEventListener('click', function(e){
  const CSSRules = getCSSRules();
  const tagName = e.target.tagName.toLowerCase();
  const id = e.target.id;
  let result = {};
  let classList = [];

  e.target.classList.forEach((el) => { classList.push(el); });

  // element styling

  let elementStyles = [];
  if (CSSRules[tagName] !== undefined) elementStyles = CSSRules[tagName];

  elementStyles.forEach((elStyle) => {
    elStyle = elStyle.split(':');
    result[elStyle[0]] = elStyle[1].trim();
  });

  // individual class styling

  let classStyles = [];
  classList.forEach((className) => {
    let classStyle = CSSRules[`.${className}`];

    if (classStyle !== undefined) {
      classStyles = classStyles.concat((classStyle));

      classStyle.forEach((style) => {
        style = style.split(':');
        result[style[0]] = style[1].trim();
      });
    }
  });

  // multiple selectors styling
  let selectors = [' '];

  selectors.push(tagName);
  classList.forEach((className)=>selectors.push(`.${className}`));
  if (id !== '') selectors.push(`#${id}`);

  permutations(selectors).filter(perm => perm.length > 1).forEach((perm)=>{
    perm = perm.join('');

    if (CSSRules[perm] !== undefined){
      CSSRules[perm].forEach((rule) => {
        let ruleParse = rule.split(':');
        result[ruleParse[0]] = ruleParse[1].trim();
      });
    }
  });

  // id styling

  let idStyles = [];
  if (CSSRules[`#${id}`] !== undefined) idStyles = CSSRules[`#${id}`];

  idStyles.forEach((idStyle) => {
    idStyle = idStyle.split(':');
    result[idStyle[0]] = idStyle[1].trim();
  });

  // output result

  console.log(
    tagName, `id: "${id}"`, `classes: "${classList.join(', ')}"`, result
  );
});
