export function splitText(value,limit=500){
 const text=String(value??''),tokens=text.match(/\s+|\S+/gu)||[''];let part='',parts=[];
 for(const token of tokens){if(part&&part.length+token.length>limit){parts.push(part);part=''}part+=token}
 if(part||!parts.length)parts.push(part);return parts;
}
export function shortText(value,limit=150){const text=String(value??'').replace(/\s+/gu,' ').trim();if(text.length<=limit)return text;const end=text.lastIndexOf(' ',limit);return (end>0?text.slice(0,end):text.split(' ')[0])+'…'}
