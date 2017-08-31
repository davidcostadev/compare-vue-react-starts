import { render } from 'prettyjson'
import request from 'request'
import { html2json } from 'html2json'


function print(info) {
  console.log(render(info))
}

function parseHtml(body) {
  const json = html2json(body)

  const elements = json

  const repoList = elements.child[1].child[3].child[7].child[3].child[1].child[3].child[3].child[1].child

  findVue(repoList)
  // listElements(repoList)
}


function listElements(elements) {
  if (elements.length) {
    
    elements.forEach(function (element, index) {
      let now = { index }

      now = prepElement(element, now)

      print(now)
    }, this);

  } else {
      print(prepElement(elements))
  }
}

function prepElement(element, now = {}) {
  if(typeof element.tag !== 'undefined') now.tag = element.tag
  if(typeof element.node !== 'undefined') now.node = element.node
  if(typeof element.attr !== 'undefined') now.attr = element.attr
  if (typeof element.child !== 'undefined') now.child = element.child.length
  if(typeof element.text !== 'undefined') now.text = element.text.trim()
  
  return now
}

function findVue(elements) {
  const infos = {}

  elements.forEach(element => {
    if (element.node === 'element') {
      let repository = element.child[1].child[1].child[1].child[2].text.replace(/[^A-Z-a-z-]/g, '')
      
      if (repository === 'vue' || repository === 'react') {
        infos[repository] = getInfo(element)
      }
    }
  })

  // print(infos)

  trendingCalc(infos)
}
  


function getInfo(element) {
  let repository = element.child[1].child[1].child[1].child[2].text.replace(/[^A-Z-a-z0-9-]/g, '')
  
  let stars = parseInt(element.child[7].child[3].child[2].text.trim().replace(',', ''), 10)
  let folks = parseInt(element.child[7].child[5].child[2].text.trim().replace(',', ''), 10)
  let trending = parseInt(element.child[7].child[11].child[2].text.trim().replace(',', ''), 10)

  // listElements(trending)
  
  return {
    // repository,
    stars,
    folks,
    trending
  }
}

function trendingCalc(infos) {
  let vue = infos.vue.stars
  let react = infos.react.stars
  
  let diference = react - vue
  let month = 1
  // console.log(`${month} vue: ${vue} react: ${react} diference ${diference}`)
  while (vue < react) {
    vue += infos.vue.trending
    react += infos.react.trending
    
    month++
    let diference = react - vue

    if (diference < 0) {
      console.log(`vue vai passar react em ${month} meses ;-p`)
    } else {
      // console.log(`${month} vue: ${vue} react: ${react} distancia ${diference}`)
    }   
  }



}


request('https://github.com/trending?since=monthly', (err, res, body) => {
  if (err) {
    console.error(err)
  }
  parseHtml(body)
})

