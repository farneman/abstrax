// @flow

// Originally inspired from Simple JavaScript Templating
// by John Resig – http://ejohn.org/ – MIT Licensed
export default function tmpl(str: string) {
  // Convert the template into pure JavaScript
  var templateStr = str.replace(/[\r\t\n]/g, ' ')
    .split('${').join('\t')
    .replace(/((^|\})[^\t]*)"/g, '$1\r')
    .replace(/\t=(.*?)\}/g, '",$1,"')
    .split('\t').join('");p.push(')
    .split('}').join('')
    .split('\r').join('\\"');

  // Generate a reusable function that will serve as a template
  // Introduce the data as local variables using with(){}
  return new Function( // eslint-disable-line no-new-func
    'obj',
     `var p=[],print=function(){p.push.apply(p,arguments);};
     with(obj){p.push("${templateStr});}return p.join("");`
  );
}
