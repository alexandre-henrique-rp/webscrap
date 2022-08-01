require('dotenv').config()
const puppeteer = require('puppeteer');
const { writeFile } = require('fs/promises');


const email = process.env.USERF;
const senha = process.env.PASSF;

const pesqisa = '#javascript';

let c = 1;

const Lista = [];

let data = new Date;
const dia = data.getDate();
const mes = data.getMonth();
const ano = data.getFullYear();
const DataAtual = dia + "_" + mes + "_" + ano;

let arquivo = 'lista_' + DataAtual + '.json';
let FileSistem = './prosp/' + arquivo;


(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage();
    await page.goto('https://www.instagram.com');
    console.log('login Instagran')
    await page.waitForSelector('a[class="_2Lks6"]');
    await page.click('span[class="KPnG0"]');
    await page.waitForSelector('span[class="_2iem"]');//login pelo facebook
    await page.waitForTimeout(500);//login pelo facebook
    await page.type('input[id="email', email, { delay: 250 });//login pelo facebook
    await page.waitForTimeout(2000);
    await page.type('input[id="pass"]', senha, { delay: 180 });//login pelo facebook
    await page.waitForTimeout(500);
    await Promise.all([
        page.waitForNavigation(),
        page.click('button[id="loginbutton"]')//login pelo facebook
    ]);
    await page.waitForTimeout(500);
    console.log('Entrou no Instagran');
    await page.waitForSelector('img[class="Rt8TI "]'); // espere pelo seletor
    await Promise.all([
        page.waitForNavigation(),
        page.click('button[class="sqdOP  L3NKy   y3zKF     "]')
    ]);
    console.log('Passou pelo alert');
    await page.waitForSelector('button[class="_a9-- _a9_1"]');// espere pelo seletor
    await page.click('button[class="_a9-- _a9_1"]');
    await page.waitForTimeout(500);
    await page.waitForSelector('input[class= "_aawh _aawj _aauy"]');// espere pelo seletor
    await page.type('input[class="_aawh _aawj _aauy"]', pesqisa, { delay: 100 });
    await page.waitForSelector('a[class= "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl _abm4 _a6hd"]');// espere pelo seletor
    await Promise.all([
        page.waitForNavigation(),
        page.click('a[class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl _abm4 _a6hd"]')
    ]);
    console.log('Entrou na pagina de pesquisa');
    await page.waitForSelector('button[class="_acan _acap _acaq _acas"]');// espere pelo seletor
    await page.waitForSelector('article a');// espere pelo seletor
    const links = await page.$$eval('div[class="_ac7v _aang"] > div > a', el => el.map(link => link.href));
    console.log(links)
    for (const link of links) {
        console.log('Pagina', c)
        await page.goto(link)
        await page.waitForSelector('span[class="_aacl _aaco _aacu _aacx _aad7 _aade"]');
        const nome = await page.$eval('span[class="_aap6 _aap7 _aap8"] > a', element => element.innerText);
        const textoNative = await page.$eval('span[class="_aacl _aaco _aacu _aacx _aad7 _aade"]', element => element.innerText);
        const texto = textoNative.toString();
        const tagsNative = await page.$$eval('span[class="_aacl _aaco _aacu _aacx _aad7 _aade"] > a', tag => tag.map(tag => tag.innerText));
        const tags = tagsNative.toString();
        const data = await page.$eval('time[class="_a9ze _a9zf"]', tempo => tempo.title);
        const linkPublic = link;
        await page.screenshot({ path: 'Lista/'+ nome +'_'+data+'.png' });


        const obj = { Nome: nome, Comentario: texto, Tags: tags, Public: data, Link: linkPublic };
        Lista.push(obj)
        c++;
    }

    writeFile(FileSistem, JSON.stringify(Lista, null, 2), 'utf-8')
        .then(() => {
            console.log('criado com susseso')
        }).catch(error => {
            console.error('Algo de errado não esta certo')
        })


    await browser.close();
})();
