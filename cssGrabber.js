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

// const classPermutations = (classList) => {
//   if (classList.length === 0) return [];
//   if (classList.length === 1) return [`.${classList[0]}`];
//
//   const otherPermutations = classPermutations(classList.slice(1));
//   const newPermutations = otherPermutations.map((permutation) => {
//     return `.${classList[0]}${permutation}`;
//   });
//
//   let morePermutations = [];
//   otherPermutations.forEach((permutation) => {
//     let idx = 0;
//     let permArr = permutation.split('.').filter(el => el!=='');
//
//     while (idx < permArr.length){
//       morePermutations =
            // morePermutations.concat((permArr.slice(0, idx).concat(
            // [classList[0]]).concat(permArr.slice(idx))));
//       idx+=1;
//     }
//   });
//
//   return newPermutations.concat(
//     otherPermutations).concat([`.${classList[0]}`]);
// };

var perms = (arr) => {
  if (arr.length === 0) return [[]];
  if (arr.length === 1) return [arr];

  let result = [[arr[0]]];
  const otherPerms = perms(arr.slice(1));

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

getCSSRules();

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
  classList.forEach(function(className){
    let classStyle = CSSRules[`.${className}`];
    if (classStyle !== undefined) {
      classStyles = classStyles.concat((classStyle));

      classStyle.forEach((style) => {
        style = style.split(':');
        result[style[0]] = style[1].trim();
      });
    }
  });

  // multiple headers styling
  let selectors = [];

  selectors.push(tagName);
  classList.forEach((className)=>selectors.push(`.${className}`));
  if (id !== '') selectors.push(`#${id}`);

  perms(selectors).filter(perm => perm.length > 1).forEach((perm)=>{
    let perm1 = perm.join('');
    let perm2 = perm.join(' ');

    if (CSSRules[perm1] !== undefined){
      CSSRules[perm1].forEach((rule) => {
        let ruleParse = rule.split(':');
        result[ruleParse[0]] = ruleParse[1].trim();
      });
    }
    if (CSSRules[perm2] !== undefined){
      CSSRules[perm2].forEach((rule) => {
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

  console.log(result);
});
