/* AVNI Computers - simple builder - the parts list.
   Part 1 is copied from the V5.5 configurator (computers/configure/index.html, 19-10-2026) so both tools show the same
   processors, boards, cards and prices. Part 2 (below the line) adds what a customer can change part by part:
   every memory kit size from 8 GB to 6 TB, and more graphics cards, drives, power supplies, coolers and cabinets.
   PRICE LABELS (shown on every part):
     inr  = our estimate in rupees incl. GST - a working number, not a quotation
     seen = a real listing we saw on Amazon.in on 18-10-2026 (one seller, one moment)
     usd  = maker's launch price in US$, shown converted at FX.usdInr, before GST and import duty
     none = price on quotation
   Our suggested machines use only rupee estimates and listings seen, never converted launch prices. */

const FX={usdInr:94.95,on:'18-10-2026',src:'dollarrupee.in daily rate (one website, not the RBI reference rate)'};
const MAKERS={
 geforce:'ASUS, MSI, Gigabyte, Zotac, PNY, Galax, Inno3D',
 rtxpro:'PNY (NVIDIA partner for professional cards) or inside Dell, HP and Lenovo workstations',
 dc:'Only through server makers: Supermicro, Dell, HPE, Lenovo, Gigabyte, ASUS',
 radeon:'Sapphire, PowerColor, XFX, ASUS, Gigabyte',
 arc:'Intel, ASRock, Sparkle, Acer',
 board:'Desktop: ASUS, MSI, Gigabyte, ASRock · Server: Supermicro, Gigabyte, ASRock Rack, ASUS, Tyan',
 ram:'Desktop: Kingston, Crucial, Corsair, G.Skill · Server (RDIMM): Samsung, SK hynix, Micron, Kingston',
 ssd:'Samsung, WD, Crucial, Kingston, Solidigm, Micron',
 psu:'Corsair, Seasonic, Cooler Master, MSI, be quiet!, Antec',
 cooler:'Noctua, Deepcool, Arctic, Thermalright, Cooler Master',
 case:'Lian Li, Fractal Design, Corsair, NZXT, Cooler Master, Ant Esports · Server: Supermicro, Chenbro, Silverstone',
 cpu:'Only AMD and Intel make these chips. Buy a boxed retail or tray unit with an Indian invoice and warranty.'
};
const ARCH={zen1:.62,zenplus:.66,zen2:.74,zen3:.86,zen4:1,zen4c:.86,zen5:1.1,zen5c:.92,haswell:.5,broadwell:.54,skylake:.6,cascade:.64,alder:.93,raptor:1,arrow:1.04,sapphire:.8,emerald:.84,granite:.95,sierra:.62,gracemont:.45,a76:.4,apple:1.15,oryon:.95,grace:.75};
const PLAT={
 'AM4':{label:'AMD AM4',socket:'AM4',note:'DDR4 desktop platform (2017–2022). Cheap and mature; no upgrade path left.'},
 'AM5':{label:'AMD AM5',socket:'AM5',note:'DDR5 desktop platform (2022–). AMD has said it will support more CPU generations.'},
 'LGA1700':{label:'Intel LGA1700',socket:'LGA1700',note:'12th–14th gen Core. Boards are either DDR4 or DDR5 — never both.'},
 'LGA1851':{label:'Intel LGA1851',socket:'LGA1851',note:'Core Ultra 200S. DDR5 only.'},
 'LGA2066':{label:'Intel LGA2066 (X299)',socket:'LGA2066',note:'Old high-end desktop, 4-channel DDR4. Historical.'},
 'LGA2011-3':{label:'Intel LGA2011-3',socket:'LGA2011-3',note:'Haswell/Broadwell era. Single-socket X99 desktops and dual-socket Xeon E5 servers. Used market only.'},
 'TR4':{label:'AMD TR4 (X399)',socket:'TR4',note:'First Threadripper. Historical.'},
 'sWRX8':{label:'AMD sWRX8 (WRX80)',socket:'sWRX8',note:'Threadripper PRO 3000/5000. 8-channel DDR4 RDIMM.'},
 'TRX50':{label:'AMD sTR5 · TRX50',socket:'sTR5',note:'Threadripper 7000/9000 (non-PRO). 4-channel DDR5 RDIMM.'},
 'WRX90':{label:'AMD sTR5 · WRX90',socket:'sTR5',note:'Threadripper PRO 7000/9000 WX. 8-channel DDR5 RDIMM, 128 PCIe 5.0 lanes.'},
 'SP3':{label:'AMD SP3',socket:'SP3',note:'EPYC 7002/7003. 8-channel DDR4. Strong used-server market.'},
 'SP5':{label:'AMD SP5',socket:'SP5',note:'EPYC 9004/9005. 12-channel DDR5 RDIMM. 1- and 2-socket boards exist.'},
 'SP6':{label:'AMD SP6',socket:'SP6',note:'EPYC 8004. 6-channel DDR5, single socket, power-efficient edge/telecom servers.'},
 'LGA3647':{label:'Intel LGA3647',socket:'LGA3647',note:'Xeon Scalable 1st/2nd gen. 6-channel DDR4. Used market.'},
 'LGA4677':{label:'Intel LGA4677',socket:'LGA4677',note:'Xeon 4th/5th gen Scalable and Xeon W-2400/3400. 8-channel DDR5 RDIMM (W-2400: 4-channel).'},
 'LGA4710':{label:'Intel LGA4710',socket:'LGA4710',note:'Xeon 6 (6700 series). Sold mostly in OEM servers.'},
 'LGA7529':{label:'Intel LGA7529',socket:'LGA7529',note:'Xeon 6 (6900 series, up to 128 P-cores). OEM servers only.'},
 'SYSTEM':{label:'Complete system only',socket:'—',note:'Processor is soldered or sold only inside a complete machine. Compare whole systems, not motherboards.'}
};
const CPU=[
 // ---- AMD AM4 ----
 {id:'athlon-3000g',n:'AMD Athlon 3000G',b:'AMD',p:'AM4',a:'zenplus',y:2019,c:2,t:4,g:3.5,w:35,ig:1,ms:1,mem:['DDR4'],box:1,usd:49,inr:5200,tier:'Entry'},
 {id:'r5-5500',n:'AMD Ryzen 5 5500',b:'AMD',p:'AM4',a:'zen3',y:2022,c:6,t:12,g:4.2,w:65,ig:0,ms:1,mem:['DDR4'],box:1,usd:159,inr:7800,tier:'Budget',note:'No integrated graphics: needs a graphics card even for office use.'},
 {id:'r5-5600',n:'AMD Ryzen 5 5600',b:'AMD',p:'AM4',a:'zen3',y:2022,c:6,t:12,g:4.4,w:65,ig:0,ms:1,mem:['DDR4'],box:1,usd:199,inr:9500,tier:'Budget'},
 {id:'r5-5600g',n:'AMD Ryzen 5 5600G',b:'AMD',p:'AM4',a:'zen3',y:2021,c:6,t:12,g:4.4,w:65,ig:1,ms:1,mem:['DDR4'],box:1,usd:259,inr:10800,tier:'Budget',note:'Integrated graphics avoids a separate card in office PCs.'},
 {id:'r5-5600x',n:'AMD Ryzen 5 5600X',b:'AMD',p:'AM4',a:'zen3',y:2020,c:6,t:12,g:4.6,w:65,ig:0,ms:1,mem:['DDR4'],box:1,usd:299,inr:11800,tier:'Previous gen'},
 {id:'r7-5700x',n:'AMD Ryzen 7 5700X',b:'AMD',p:'AM4',a:'zen3',y:2022,c:8,t:16,g:4.6,w:65,ig:0,ms:1,mem:['DDR4'],box:0,usd:299,inr:13500,tier:'Previous gen'},
 {id:'r7-5700g',n:'AMD Ryzen 7 5700G',b:'AMD',p:'AM4',a:'zen3',y:2021,c:8,t:16,g:4.6,w:65,ig:1,ms:1,mem:['DDR4'],box:1,usd:359,inr:14500,tier:'Previous gen'},
 {id:'r7-5700x3d',n:'AMD Ryzen 7 5700X3D',b:'AMD',p:'AM4',a:'zen3',y:2024,c:8,t:16,g:4.1,w:105,ig:0,ms:1,mem:['DDR4'],box:0,usd:249,inr:null,tier:'Gaming',seen:[{p:67283,x:57019,mrp:72308}],note:'The listing seen is far above the US$249 launch price. Compare several sellers before paying.',x3d:1},
 {id:'r9-5900x',n:'AMD Ryzen 9 5900X',b:'AMD',p:'AM4',a:'zen3',y:2020,c:12,t:24,g:4.8,w:105,ig:0,ms:1,mem:['DDR4'],box:0,usd:549,inr:22000,tier:'Previous gen'},
 {id:'r9-5950x',n:'AMD Ryzen 9 5950X',b:'AMD',p:'AM4',a:'zen3',y:2020,c:16,t:32,g:4.9,w:105,ig:0,ms:1,mem:['DDR4'],box:0,usd:799,inr:30000,tier:'Previous gen'},
 {id:'r9-3900x',n:'AMD Ryzen 9 3900X',b:'AMD',p:'AM4',a:'zen2',y:2019,c:12,t:24,g:4.6,w:105,ig:0,ms:1,mem:['DDR4'],box:1,usd:499,inr:null,tier:'Historical',seen:[{p:56942,x:48256,mrp:75000}],note:'2019 processor listed at a 2026 flagship price. Price is not performance.'},
 {id:'r9-3950x',n:'AMD Ryzen 9 3950X',b:'AMD',p:'AM4',a:'zen2',y:2019,c:16,t:32,g:4.7,w:105,ig:0,ms:1,mem:['DDR4'],box:0,usd:749,inr:null,tier:'Historical',seen:[{p:55943,x:47409,mrp:106350}],note:'Older than the Ryzen 9 9950X yet listed at a similar price.'},
 // ---- AMD AM5 ----
 {id:'r5-7500f',n:'AMD Ryzen 5 7500F',b:'AMD',p:'AM5',a:'zen4',y:2023,c:6,t:12,g:5.0,w:65,ig:0,ms:1,mem:['DDR5'],box:1,usd:179,inr:12500,tier:'Budget'},
 {id:'r5-8500g',n:'AMD Ryzen 5 8500G',b:'AMD',p:'AM5',a:'zen4',pc:2,y:2024,c:6,t:12,g:5.0,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:179,inr:13500,tier:'Office',note:'2 full + 4 compact cores. Good integrated graphics for office.'},
 {id:'r5-7600',n:'AMD Ryzen 5 7600',b:'AMD',p:'AM5',a:'zen4',y:2023,c:6,t:12,g:5.1,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:229,inr:16500,tier:'Mainstream'},
 {id:'r5-8600g',n:'AMD Ryzen 5 8600G',b:'AMD',p:'AM5',a:'zen4',y:2024,c:6,t:12,g:5.0,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:229,inr:17500,tier:'Office'},
 {id:'r5-7600x',n:'AMD Ryzen 5 7600X',b:'AMD',p:'AM5',a:'zen4',y:2022,c:6,t:12,g:5.3,w:105,ig:1,ms:1,mem:['DDR5'],box:0,usd:299,inr:18500,tier:'Mainstream'},
 {id:'r5-9600x',n:'AMD Ryzen 5 9600X',b:'AMD',p:'AM5',a:'zen5',y:2024,c:6,t:12,g:5.4,w:65,ig:1,ms:1,mem:['DDR5'],box:0,usd:279,inr:22000,tier:'Mainstream'},
 {id:'r7-7700',n:'AMD Ryzen 7 7700',b:'AMD',p:'AM5',a:'zen4',y:2023,c:8,t:16,g:5.3,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:329,inr:24000,tier:'Mainstream'},
 {id:'r7-8700g',n:'AMD Ryzen 7 8700G',b:'AMD',p:'AM5',a:'zen4',y:2024,c:8,t:16,g:5.1,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:329,inr:25500,tier:'Office'},
 {id:'r7-9700x',n:'AMD Ryzen 7 9700X',b:'AMD',p:'AM5',a:'zen5',y:2024,c:8,t:16,g:5.5,w:65,ig:1,ms:1,mem:['DDR5'],box:0,usd:359,inr:28500,tier:'Mainstream'},
 {id:'r9-7900',n:'AMD Ryzen 9 7900',b:'AMD',p:'AM5',a:'zen4',y:2023,c:12,t:24,g:5.4,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:429,inr:30500,tier:'Creator'},
 {id:'r7-7800x3d',n:'AMD Ryzen 7 7800X3D',b:'AMD',p:'AM5',a:'zen4',y:2023,c:8,t:16,g:5.0,w:120,ig:1,ms:1,mem:['DDR5'],box:0,usd:449,inr:34000,tier:'Gaming',x3d:1},
 {id:'r9-9900x',n:'AMD Ryzen 9 9900X',b:'AMD',p:'AM5',a:'zen5',y:2024,c:12,t:24,g:5.6,w:120,ig:1,ms:1,mem:['DDR5'],box:0,usd:499,inr:38000,tier:'Creator'},
 {id:'r9-7950x',n:'AMD Ryzen 9 7950X',b:'AMD',p:'AM5',a:'zen4',y:2022,c:16,t:32,g:5.7,w:170,ig:1,ms:1,mem:['DDR5'],box:0,usd:699,inr:45000,tier:'Creator'},
 {id:'r7-9800x3d',n:'AMD Ryzen 7 9800X3D',b:'AMD',p:'AM5',a:'zen5',y:2024,c:8,t:16,g:5.2,w:120,ig:1,ms:1,mem:['DDR5'],box:0,usd:479,inr:46000,tier:'Gaming',x3d:1},
 {id:'r7-9850x3d',n:'AMD Ryzen 7 9850X3D',b:'AMD',p:'AM5',a:'zen5',y:2026,c:8,t:16,g:5.6,w:120,ig:1,ms:1,mem:['DDR5'],box:0,usd:null,inr:null,tier:'Gaming',x3d:1,seen:[{p:58169,x:49296,mrp:160000}],note:'Newer than AVNI\'s knowledge base: core count and clocks to be re-verified on amd.com.'},
 {id:'r9-9900x3d',n:'AMD Ryzen 9 9900X3D',b:'AMD',p:'AM5',a:'zen5',y:2025,c:12,t:24,g:5.5,w:120,ig:1,ms:1,mem:['DDR5'],box:0,usd:599,inr:null,tier:'Gaming/Creator',x3d:1,seen:[{p:69329,x:58753,mrp:95000}]},
 {id:'r9-9950x',n:'AMD Ryzen 9 9950X',b:'AMD',p:'AM5',a:'zen5',y:2024,c:16,t:32,g:5.7,w:170,ig:1,ms:1,mem:['DDR5'],box:0,usd:649,inr:null,tier:'Creator',seen:[{p:71999,x:61016,mrp:75000}]},
 {id:'r9-9950x3d',n:'AMD Ryzen 9 9950X3D',b:'AMD',p:'AM5',a:'zen5',y:2025,c:16,t:32,g:5.7,w:170,ig:1,ms:1,mem:['DDR5'],box:0,usd:699,inr:null,tier:'Gaming/Creator',x3d:1,seen:[{p:71980,x:61000,mrp:110000}]},
 {id:'r9-7950x3d',n:'AMD Ryzen 9 7950X3D',b:'AMD',p:'AM5',a:'zen4',y:2023,c:16,t:32,g:5.7,w:120,ig:1,ms:1,mem:['DDR5'],box:0,usd:699,inr:null,tier:'Gaming/Creator',x3d:1,seen:[{p:74999,x:63558,mrp:97000}]},
 {id:'r9-9950x3d2',n:'AMD Ryzen 9 9950X3D2 Dual Edition',b:'AMD',p:'AM5',a:'zen5',y:2026,c:16,t:32,g:null,w:null,ig:1,ms:1,mem:['DDR5'],box:0,usd:null,inr:null,tier:'Gaming/Creator',x3d:1,seen:[{p:105899,x:89745,mrp:160000}],note:'Newer than AVNI\'s knowledge base. Clocks and power not yet verified, so we will not rank its performance.'},
 {id:'epyc-4244p',n:'AMD EPYC 4244P',b:'AMD',p:'AM5',a:'zen4',y:2024,c:6,t:12,g:5.1,w:65,ig:1,ms:1,mem:['DDR5'],ecc:'udimm',box:0,usd:229,inr:21000,tier:'Small server',note:'Server-validated AM5 chip: ECC memory on server AM5 boards.'},
 {id:'epyc-4344p',n:'AMD EPYC 4344P',b:'AMD',p:'AM5',a:'zen4',y:2024,c:8,t:16,g:5.3,w:65,ig:1,ms:1,mem:['DDR5'],ecc:'udimm',box:0,usd:329,inr:30000,tier:'Small server'},
 {id:'epyc-4464p',n:'AMD EPYC 4464P',b:'AMD',p:'AM5',a:'zen4',y:2024,c:12,t:24,g:5.4,w:65,ig:1,ms:1,mem:['DDR5'],ecc:'udimm',box:0,usd:429,inr:39000,tier:'Small server'},
 {id:'epyc-4564p',n:'AMD EPYC 4564P',b:'AMD',p:'AM5',a:'zen4',y:2024,c:16,t:32,g:5.7,w:170,ig:1,ms:1,mem:['DDR5'],ecc:'udimm',box:0,usd:699,inr:62000,tier:'Small server'},
 // ---- Intel LGA1700 ----
 {id:'g7400',n:'Intel Pentium Gold G7400',b:'Intel',p:'LGA1700',a:'alder',y:2022,c:2,t:4,g:3.7,w:46,ig:1,ms:1,mem:['DDR4','DDR5'],box:1,usd:64,inr:6200,tier:'Entry'},
 {id:'i3-12100',n:'Intel Core i3-12100',b:'Intel',p:'LGA1700',a:'alder',y:2022,c:4,t:8,g:4.3,w:60,ig:1,ms:1,mem:['DDR4','DDR5'],box:1,usd:122,inr:8800,tier:'Office'},
 {id:'i3-14100',n:'Intel Core i3-14100',b:'Intel',p:'LGA1700',a:'raptor',y:2024,c:4,t:8,g:4.7,w:60,ig:1,ms:1,mem:['DDR4','DDR5'],box:1,usd:134,inr:10800,tier:'Office'},
 {id:'i5-12400f',n:'Intel Core i5-12400F',b:'Intel',p:'LGA1700',a:'alder',y:2022,c:6,t:12,g:4.4,w:65,ig:0,ms:1,mem:['DDR4','DDR5'],box:1,usd:167,inr:9800,tier:'Budget',note:'F = no integrated graphics.'},
 {id:'i5-12400',n:'Intel Core i5-12400',b:'Intel',p:'LGA1700',a:'alder',y:2022,c:6,t:12,g:4.4,w:65,ig:1,ms:1,mem:['DDR4','DDR5'],box:1,usd:192,inr:12800,tier:'Office'},
 {id:'i5-13400',n:'Intel Core i5-13400',b:'Intel',p:'LGA1700',a:'raptor',pc:6,y:2023,c:10,t:16,g:4.6,w:65,ig:1,ms:1,mem:['DDR4','DDR5'],box:1,usd:221,inr:16800,tier:'Mainstream'},
 {id:'i5-14400',n:'Intel Core i5-14400',b:'Intel',p:'LGA1700',a:'raptor',pc:6,y:2024,c:10,t:16,g:4.7,w:65,ig:1,ms:1,mem:['DDR4','DDR5'],box:1,usd:221,inr:18200,tier:'Mainstream'},
 {id:'i7-12700k',n:'Intel Core i7-12700K',b:'Intel',p:'LGA1700',a:'alder',pc:8,y:2021,c:12,t:20,g:5.0,w:125,ig:1,ms:1,mem:['DDR4','DDR5'],box:0,usd:409,inr:25500,tier:'Previous gen'},
 {id:'i5-14600k',n:'Intel Core i5-14600K',b:'Intel',p:'LGA1700',a:'raptor',pc:6,y:2023,c:14,t:20,g:5.3,w:125,ig:1,ms:1,mem:['DDR4','DDR5'],box:0,usd:319,inr:26500,tier:'Mainstream'},
 {id:'i7-13700k',n:'Intel Core i7-13700K',b:'Intel',p:'LGA1700',a:'raptor',pc:8,y:2022,c:16,t:24,g:5.4,w:125,ig:1,ms:1,mem:['DDR4','DDR5'],box:0,usd:409,inr:32500,tier:'Previous gen'},
 {id:'i9-12900k',n:'Intel Core i9-12900K',b:'Intel',p:'LGA1700',a:'alder',pc:8,y:2021,c:16,t:24,g:5.2,w:125,ig:1,ms:1,mem:['DDR4','DDR5'],box:0,usd:589,inr:33000,tier:'Previous gen'},
 {id:'i7-14700k',n:'Intel Core i7-14700K',b:'Intel',p:'LGA1700',a:'raptor',pc:8,y:2023,c:20,t:28,g:5.6,w:125,ig:1,ms:1,mem:['DDR4','DDR5'],box:0,usd:409,inr:36500,tier:'Creator'},
 {id:'i9-13900k',n:'Intel Core i9-13900K',b:'Intel',p:'LGA1700',a:'raptor',pc:8,y:2022,c:24,t:32,g:5.8,w:125,ig:1,ms:1,mem:['DDR4','DDR5'],box:0,usd:589,inr:null,tier:'Previous gen',seen:[{p:55959,x:47423,mrp:94800,note:'Listing showed "only 1 left in stock"; photo shows an unboxed chip — confirm new/used condition.'}]},
 {id:'i9-13900kf',n:'Intel Core i9-13900KF',b:'Intel',p:'LGA1700',a:'raptor',pc:8,y:2022,c:24,t:32,g:5.8,w:125,ig:0,ms:1,mem:['DDR4','DDR5'],box:0,usd:564,inr:null,tier:'Previous gen',seen:[{p:66445,x:56309,mrp:71457,note:'Listing image shows a cooler — confirm what is actually in the box.'}]},
 {id:'i9-14900k',n:'Intel Core i9-14900K',b:'Intel',p:'LGA1700',a:'raptor',pc:8,y:2023,c:24,t:32,g:6.0,w:125,ig:1,ms:1,mem:['DDR4','DDR5'],box:0,usd:589,inr:50000,tier:'Creator',note:'Install the latest BIOS (Intel 0x12B microcode family) before heavy use.'},
 // ---- Intel LGA1851 ----
 {id:'u5-225',n:'Intel Core Ultra 5 225',b:'Intel',p:'LGA1851',a:'arrow',pc:6,y:2025,c:10,t:10,g:4.9,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:236,inr:19500,tier:'Mainstream'},
 {id:'u5-245k',n:'Intel Core Ultra 5 245K',b:'Intel',p:'LGA1851',a:'arrow',pc:6,y:2024,c:14,t:14,g:5.2,w:125,ig:1,ms:1,mem:['DDR5'],box:0,usd:309,inr:26500,tier:'Mainstream'},
 {id:'u7-265k',n:'Intel Core Ultra 7 265K',b:'Intel',p:'LGA1851',a:'arrow',pc:8,y:2024,c:20,t:20,g:5.5,w:125,ig:1,ms:1,mem:['DDR5'],box:0,usd:394,inr:33500,tier:'Creator'},
 {id:'u9-285k',n:'Intel Core Ultra 9 285K',b:'Intel',p:'LGA1851',a:'arrow',pc:8,y:2024,c:24,t:24,g:5.7,w:125,ig:1,ms:1,mem:['DDR5'],box:0,usd:589,inr:null,tier:'Creator',seen:[{p:62649,x:53092,mrp:82350}]},
 {id:'u9-285',n:'Intel Core Ultra 9 285',b:'Intel',p:'LGA1851',a:'arrow',pc:8,y:2025,c:24,t:24,g:5.6,w:65,ig:1,ms:1,mem:['DDR5'],box:1,usd:549,inr:null,tier:'Creator',seen:[{p:65079,x:55152,mrp:83500}]},
 // ---- Intel historical HEDT ----
 {id:'i7-5960x',n:'Intel Core i7-5960X',b:'Intel',p:'LGA2011-3',a:'haswell',y:2014,c:8,t:16,g:3.5,w:140,ig:0,ms:1,mem:['DDR4'],box:0,usd:999,inr:null,tier:'Historical',seen:[{p:61937,x:52489,mrp:145000}],note:'A 2014 chip. A modern ₹10,000 CPU is faster in single-thread work.'},
 {id:'i7-6900k',n:'Intel Core i7-6900K',b:'Intel',p:'LGA2011-3',a:'broadwell',y:2016,c:8,t:16,g:4.0,w:140,ig:0,ms:1,mem:['DDR4'],box:0,usd:1089,inr:null,tier:'Historical',seen:[{p:79910,x:67720,mrp:145000,note:'Listed by a third-party seller.'}]},
 {id:'i9-10900x',n:'Intel Core i9-10900X',b:'Intel',p:'LGA2066',a:'cascade',y:2019,c:10,t:20,g:4.7,w:165,ig:0,ms:1,mem:['DDR4'],box:0,usd:590,inr:null,tier:'Historical',seen:[{p:57442,x:48679,mrp:110000}]},
 {id:'i9-10980xe',n:'Intel Core i9-10980XE',b:'Intel',p:'LGA2066',a:'cascade',y:2019,c:18,t:36,g:4.8,w:165,ig:0,ms:1,mem:['DDR4'],box:0,usd:979,inr:null,tier:'Historical',seen:[{p:74809,x:63397,mrp:140250}]},
 // ---- Xeon E5 / Scalable (used market) ----
 {id:'e5-2690v4',n:'Intel Xeon E5-2690 v4',b:'Intel',p:'LGA2011-3',a:'broadwell',y:2016,c:14,t:28,g:3.5,w:135,ig:0,ms:2,mem:['DDR4'],ecc:'rdimm',box:0,usd:2090,inr:4500,tier:'Used server',cond:'used',note:'Used-market estimate. Popular for cheap dual-socket home servers; high power for its speed.'},
 {id:'xg-6130',n:'Intel Xeon Gold 6130',b:'Intel',p:'LGA3647',a:'skylake',y:2017,c:16,t:32,g:3.7,w:125,ig:0,ms:4,mem:['DDR4'],ecc:'rdimm',box:0,usd:1894,inr:null,tier:'Historical server',seen:[{p:62936,x:53336,mrp:85000}],note:'Gold 6100 series supports up to 4 sockets on a 4-socket platform. A 2017 server chip listed at a new-desktop price.'},
 {id:'xg-6148',n:'Intel Xeon Gold 6148',b:'Intel',p:'LGA3647',a:'skylake',y:2017,c:20,t:40,g:3.7,w:150,ig:0,ms:4,mem:['DDR4'],ecc:'rdimm',box:0,usd:3072,inr:null,tier:'Historical server',seen:[{p:74924,x:63495,mrp:95000}]},
 {id:'xs-4210',n:'Intel Xeon Silver 4210',b:'Intel',p:'LGA3647',a:'cascade',y:2019,c:10,t:20,g:3.2,w:85,ig:0,ms:2,mem:['DDR4'],ecc:'rdimm',box:0,usd:501,inr:9000,tier:'Used server',cond:'used'},
 {id:'xp-8180',n:'Intel Xeon Platinum 8180',b:'Intel',p:'LGA3647',a:'skylake',y:2017,c:28,t:56,g:3.8,w:205,ig:0,ms:8,mem:['DDR4'],ecc:'rdimm',box:0,usd:10009,inr:null,tier:'Historical 8-socket',cond:'used',note:'Platinum supports up to 8 sockets — but only inside a certified 8-socket OEM system.'},
 {id:'xs-4410y',n:'Intel Xeon Silver 4410Y',b:'Intel',p:'LGA4677',a:'sapphire',y:2023,c:12,t:24,g:3.9,w:150,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:563,inr:62000,tier:'Server'},
 {id:'xg-5418y',n:'Intel Xeon Gold 5418Y',b:'Intel',p:'LGA4677',a:'sapphire',y:2023,c:24,t:48,g:3.8,w:185,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:1483,inr:150000,tier:'Server'},
 {id:'xg-6430',n:'Intel Xeon Gold 6430',b:'Intel',p:'LGA4677',a:'sapphire',y:2023,c:32,t:64,g:3.4,w:270,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:2128,inr:220000,tier:'Server'},
 {id:'xp-8480p',n:'Intel Xeon Platinum 8480+',b:'Intel',p:'LGA4677',a:'sapphire',y:2023,c:56,t:112,g:3.8,w:350,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:10710,inr:null,tier:'Server',note:'Socket scalability depends on exact SKU — this one is listed by Intel for 2-socket systems.'},
 {id:'xp-8592p',n:'Intel Xeon Platinum 8592+',b:'Intel',p:'LGA4677',a:'emerald',y:2023,c:64,t:128,g:3.9,w:350,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:11600,inr:null,tier:'Server'},
 {id:'w5-2455x',n:'Intel Xeon w5-2455X',b:'Intel',p:'LGA4677',a:'sapphire',y:2023,c:12,t:24,g:4.6,w:200,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:1039,inr:110000,tier:'Workstation',w790:1},
 {id:'w7-2495x',n:'Intel Xeon w7-2495X',b:'Intel',p:'LGA4677',a:'sapphire',y:2023,c:24,t:48,g:4.8,w:225,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:2189,inr:215000,tier:'Workstation',w790:1},
 {id:'w9-3495x',n:'Intel Xeon w9-3495X',b:'Intel',p:'LGA4677',a:'sapphire',y:2023,c:56,t:112,g:4.8,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:5889,inr:560000,tier:'Workstation',w790:1},
 {id:'x6-6780e',n:'Intel Xeon 6780E',b:'Intel',p:'LGA4710',a:'sierra',y:2024,c:144,t:144,g:3.0,w:330,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:null,inr:null,tier:'OEM server',note:'Efficiency cores for dense cloud work. OEM quotation required.'},
 {id:'x6-6980p',n:'Intel Xeon 6980P',b:'Intel',p:'LGA7529',a:'granite',y:2024,c:128,t:256,g:3.9,w:500,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:null,inr:null,tier:'OEM server',note:'Up to 128 performance cores. Sold through OEM servers; quotation required.'},
 // ---- Threadripper ----
 {id:'tr-1950x',n:'AMD Ryzen Threadripper 1950X',b:'AMD',p:'TR4',a:'zen1',y:2017,c:16,t:32,g:4.0,w:180,ig:0,ms:1,mem:['DDR4'],box:0,usd:999,inr:null,tier:'Historical',seen:[{p:72917,x:61794,mrp:112000,note:'Only 1 left in stock.'}],note:'A 2017 chip listed at more than a 2024 Ryzen 9 9950X.'},
 {id:'tr-7960x',n:'AMD Ryzen Threadripper 7960X',b:'AMD',p:'TRX50',a:'zen4',y:2023,c:24,t:48,g:5.3,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:1499,inr:150000,tier:'Workstation'},
 {id:'tr-9960x',n:'AMD Ryzen Threadripper 9960X',b:'AMD',p:'TRX50',a:'zen5',y:2025,c:24,t:48,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:1499,inr:158000,tier:'Workstation'},
 {id:'tr-7970x',n:'AMD Ryzen Threadripper 7970X',b:'AMD',p:'TRX50',a:'zen4',y:2023,c:32,t:64,g:5.3,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:2499,inr:245000,tier:'Workstation'},
 {id:'tr-9970x',n:'AMD Ryzen Threadripper 9970X',b:'AMD',p:'TRX50',a:'zen5',y:2025,c:32,t:64,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:2499,inr:255000,tier:'Workstation'},
 {id:'tr-7980x',n:'AMD Ryzen Threadripper 7980X',b:'AMD',p:'TRX50',a:'zen4',y:2023,c:64,t:128,g:5.1,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:4999,inr:480000,tier:'Workstation'},
 {id:'tr-9980x',n:'AMD Ryzen Threadripper 9980X',b:'AMD',p:'TRX50',a:'zen5',y:2025,c:64,t:128,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:4999,inr:495000,tier:'Workstation'},
 {id:'trp-5975wx',n:'AMD Ryzen Threadripper PRO 5975WX',b:'AMD',p:'sWRX8',a:'zen3',y:2022,c:32,t:64,g:4.5,w:280,ig:0,ms:1,mem:['DDR4'],ecc:'rdimm',box:0,usd:3299,inr:null,tier:'Workstation PRO',seen:[{p:419579,x:355575,mrp:575000,note:'Amazon Business price. Only 2 left in stock.'}],note:'Previous-generation PRO. Uses sWRX8 boards — not the newer sTR5.'},
 {id:'trp-5995wx',n:'AMD Ryzen Threadripper PRO 5995WX',b:'AMD',p:'sWRX8',a:'zen3',y:2022,c:64,t:128,g:4.5,w:280,ig:0,ms:1,mem:['DDR4'],ecc:'rdimm',box:0,usd:6499,inr:null,tier:'Workstation PRO'},
 {id:'trp-9955wx',n:'AMD Ryzen Threadripper PRO 9955WX',b:'AMD',p:'WRX90',a:'zen5',y:2025,c:16,t:32,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:1649,inr:170000,tier:'Workstation PRO'},
 {id:'trp-7965wx',n:'AMD Ryzen Threadripper PRO 7965WX',b:'AMD',p:'WRX90',a:'zen4',y:2023,c:24,t:48,g:5.3,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:2649,inr:265000,tier:'Workstation PRO'},
 {id:'trp-9965wx',n:'AMD Ryzen Threadripper PRO 9965WX',b:'AMD',p:'WRX90',a:'zen5',y:2025,c:24,t:48,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:2899,inr:290000,tier:'Workstation PRO'},
 {id:'trp-7975wx',n:'AMD Ryzen Threadripper PRO 7975WX',b:'AMD',p:'WRX90',a:'zen4',y:2023,c:32,t:64,g:5.3,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:3899,inr:385000,tier:'Workstation PRO'},
 {id:'trp-9975wx',n:'AMD Ryzen Threadripper PRO 9975WX',b:'AMD',p:'WRX90',a:'zen5',y:2025,c:32,t:64,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:4099,inr:410000,tier:'Workstation PRO'},
 {id:'trp-7985wx',n:'AMD Ryzen Threadripper PRO 7985WX',b:'AMD',p:'WRX90',a:'zen4',y:2023,c:64,t:128,g:5.1,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:7349,inr:720000,tier:'Workstation PRO'},
 {id:'trp-9985wx',n:'AMD Ryzen Threadripper PRO 9985WX',b:'AMD',p:'WRX90',a:'zen5',y:2025,c:64,t:128,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:7999,inr:790000,tier:'Workstation PRO'},
 {id:'trp-7995wx',n:'AMD Ryzen Threadripper PRO 7995WX',b:'AMD',p:'WRX90',a:'zen4',y:2023,c:96,t:192,g:5.1,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:9999,inr:980000,tier:'Workstation PRO'},
 {id:'trp-9995wx',n:'AMD Ryzen Threadripper PRO 9995WX',b:'AMD',p:'WRX90',a:'zen5',y:2025,c:96,t:192,g:5.4,w:350,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:11699,inr:1150000,tier:'Workstation PRO',note:'96 cores helps only work that really uses 96 cores. Many programs use far fewer.'},
 // ---- EPYC ----
 {id:'epyc-7302',n:'AMD EPYC 7302',b:'AMD',p:'SP3',a:'zen2',y:2019,c:16,t:32,g:3.3,w:155,ig:0,ms:2,mem:['DDR4'],ecc:'rdimm',box:0,usd:978,inr:12000,tier:'Used server',cond:'used',note:'Used-market estimate. Check for vendor lock (PSB) before buying a used EPYC.'},
 {id:'epyc-7543',n:'AMD EPYC 7543',b:'AMD',p:'SP3',a:'zen3',y:2021,c:32,t:64,g:3.7,w:225,ig:0,ms:2,mem:['DDR4'],ecc:'rdimm',box:0,usd:3761,inr:45000,tier:'Used server',cond:'used',note:'Used-market estimate. Check for vendor lock (PSB).'},
 {id:'epyc-7742',n:'AMD EPYC 7742',b:'AMD',p:'SP3',a:'zen2',y:2019,c:64,t:128,g:3.4,w:225,ig:0,ms:2,mem:['DDR4'],ecc:'rdimm',box:0,usd:6950,inr:60000,tier:'Used server',cond:'used',note:'Used-market estimate.'},
 {id:'epyc-8324p',n:'AMD EPYC 8324P',b:'AMD',p:'SP6',a:'zen4c',y:2023,c:32,t:64,g:3.0,w:180,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:1895,inr:190000,tier:'Server 1-socket',note:'"P" means single-socket only.'},
 {id:'epyc-8534p',n:'AMD EPYC 8534P',b:'AMD',p:'SP6',a:'zen4c',y:2023,c:64,t:128,g:3.1,w:200,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:4950,inr:480000,tier:'Server 1-socket'},
 {id:'epyc-9124',n:'AMD EPYC 9124',b:'AMD',p:'SP5',a:'zen4',y:2022,c:16,t:32,g:3.7,w:200,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:1083,inr:110000,tier:'Server'},
 {id:'epyc-9254',n:'AMD EPYC 9254',b:'AMD',p:'SP5',a:'zen4',y:2022,c:24,t:48,g:4.15,w:200,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:2299,inr:225000,tier:'Server'},
 {id:'epyc-9354p',n:'AMD EPYC 9354P',b:'AMD',p:'SP5',a:'zen4',y:2022,c:32,t:64,g:3.8,w:280,ig:0,ms:1,mem:['DDR5'],ecc:'rdimm',box:0,usd:2730,inr:270000,tier:'Server 1-socket',note:'"P" = single-socket only. Cheaper than the 9354 for the same cores.'},
 {id:'epyc-9354',n:'AMD EPYC 9354',b:'AMD',p:'SP5',a:'zen4',y:2022,c:32,t:64,g:3.8,w:280,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:3420,inr:335000,tier:'Server'},
 {id:'epyc-9355',n:'AMD EPYC 9355',b:'AMD',p:'SP5',a:'zen5',y:2024,c:32,t:64,g:4.4,w:280,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:3694,inr:365000,tier:'Server'},
 {id:'epyc-9454',n:'AMD EPYC 9454',b:'AMD',p:'SP5',a:'zen4',y:2022,c:48,t:96,g:3.8,w:290,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:5225,inr:510000,tier:'Server'},
 {id:'epyc-9554',n:'AMD EPYC 9554',b:'AMD',p:'SP5',a:'zen4',y:2022,c:64,t:128,g:3.75,w:360,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:9087,inr:880000,tier:'Server'},
 {id:'epyc-9555',n:'AMD EPYC 9555',b:'AMD',p:'SP5',a:'zen5',y:2024,c:64,t:128,g:4.4,w:360,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:9826,inr:950000,tier:'Server'},
 {id:'epyc-9575f',n:'AMD EPYC 9575F',b:'AMD',p:'SP5',a:'zen5',y:2024,c:64,t:128,g:5.0,w:400,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:11791,inr:null,tier:'Server',note:'High-frequency part often used as the host CPU in GPU servers.'},
 {id:'epyc-9654',n:'AMD EPYC 9654',b:'AMD',p:'SP5',a:'zen4',y:2022,c:96,t:192,g:3.7,w:360,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:11805,inr:1150000,tier:'Server'},
 {id:'epyc-9754',n:'AMD EPYC 9754',b:'AMD',p:'SP5',a:'zen4c',y:2023,c:128,t:256,g:3.1,w:360,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:11900,inr:1160000,tier:'Server'},
 {id:'epyc-9755',n:'AMD EPYC 9755',b:'AMD',p:'SP5',a:'zen5',y:2024,c:128,t:256,g:4.1,w:500,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:12984,inr:null,tier:'Server'},
 {id:'epyc-9965',n:'AMD EPYC 9965',b:'AMD',p:'SP5',a:'zen5c',y:2024,c:192,t:384,g:3.7,w:500,ig:0,ms:2,mem:['DDR5'],ecc:'rdimm',box:0,usd:14813,inr:null,tier:'Server',note:'192 compact cores per socket — 384 cores in a 2-socket server.'},
 // ---- complete-system-only processors ----
 {id:'n100',n:'Intel N100 (mini PCs)',b:'Intel',p:'SYSTEM',a:'gracemont',y:2023,c:4,t:4,g:3.4,w:6,ig:1,ms:0,mem:['LPDDR5/DDR4'],box:0,usd:null,inr:null,tier:'Complete system',note:'Soldered. Compare complete mini PCs in the office fleet section.'},
 {id:'bcm2712',n:'Raspberry Pi 5 (BCM2712)',b:'Raspberry Pi',p:'SYSTEM',a:'a76',y:2023,c:4,t:4,g:2.4,w:7,ig:1,ms:0,mem:['LPDDR4X'],box:0,usd:null,inr:null,tier:'Complete system',note:'A real learning computer for a child. Linux only.'},
 {id:'m4',n:'Apple M4 (Mac mini / MacBook Air)',b:'Apple',p:'SYSTEM',a:'apple',pc:4,y:2024,c:10,t:10,g:4.4,w:22,ig:1,ms:0,mem:['Unified'],box:0,usd:null,inr:null,tier:'Complete system'},
 {id:'m4max',n:'Apple M4 Max (MacBook Pro / Mac Studio)',b:'Apple',p:'SYSTEM',a:'apple',pc:12,y:2024,c:16,t:16,g:4.5,w:90,ig:1,ms:0,mem:['Unified'],box:0,usd:null,inr:null,tier:'Complete system'},
 {id:'m3ultra',n:'Apple M3 Ultra (Mac Studio)',b:'Apple',p:'SYSTEM',a:'apple',pc:24,y:2025,c:32,t:32,g:4.05,w:200,ig:1,ms:0,mem:['Unified'],box:0,usd:null,inr:null,tier:'Complete system',note:'Up to 512 GB unified memory — useful for very large local AI models, slower than big NVIDIA GPUs for training.'},
 {id:'xelite',n:'Snapdragon X Elite (laptops)',b:'Qualcomm',p:'SYSTEM',a:'oryon',y:2024,c:12,t:12,g:4.2,w:45,ig:1,ms:0,mem:['LPDDR5X'],box:0,usd:null,inr:null,tier:'Complete system',note:'Windows on Arm. Check your exact apps (CorelDRAW, older drivers, CRM plug-ins).'},
 {id:'gb10',n:'NVIDIA GB10 Grace Blackwell (DGX Spark)',b:'NVIDIA',p:'SYSTEM',a:'grace',y:2025,c:20,t:20,g:3.9,w:240,ig:1,ms:0,mem:['128 GB unified'],box:0,usd:null,inr:null,tier:'Complete system',note:'Compact AI developer box with 128 GB unified memory.'},
 {id:'grace',n:'NVIDIA Grace CPU Superchip',b:'NVIDIA',p:'SYSTEM',a:'grace',y:2023,c:144,t:144,g:3.4,w:500,ig:0,ms:0,mem:['LPDDR5X'],box:0,usd:null,inr:null,tier:'Complete system',note:'Only inside certified servers (GH200/GB200).'}
];
const BOARD=[
 {id:'ga-a520mk',n:'Gigabyte A520M K V2',b:'Gigabyte',p:'AM4',chip:'A520',s:1,ff:'mATX',mem:'DDR4 UDIMM',dimm:2,max:64,x16:1,wide:1,m2:1,sata:4,u2:0,lan:'1 GbE',inr:5800},
 {id:'msi-b550m',n:'MSI B550M PRO-VDH WIFI',b:'MSI',p:'AM4',chip:'B550',s:1,ff:'mATX',mem:'DDR4 UDIMM',dimm:4,max:128,x16:2,wide:1,m2:2,sata:4,u2:0,lan:'1 GbE + Wi-Fi',inr:10500},
 {id:'asus-x570p',n:'ASUS TUF Gaming X570-PLUS',b:'ASUS',p:'AM4',chip:'X570',s:1,ff:'ATX',mem:'DDR4 UDIMM',dimm:4,max:128,x16:2,wide:2,m2:2,sata:8,u2:0,lan:'1 GbE',inr:16500,note:'Second x16 slot is electrically x4.'},
 {id:'msi-a620m',n:'MSI PRO A620M-E',b:'MSI',p:'AM5',chip:'A620',s:1,ff:'mATX',mem:'DDR5 UDIMM',dimm:2,max:128,x16:1,wide:1,m2:1,sata:4,u2:0,lan:'1 GbE',inr:8200,note:'A620 boards are for 65 W-class CPUs; check the board\'s CPU support list for 120–170 W chips.',maxw:120},
 {id:'msi-b650m',n:'MSI PRO B650M-A WIFI',b:'MSI',p:'AM5',chip:'B650',s:1,ff:'mATX',mem:'DDR5 UDIMM',dimm:4,max:256,x16:2,wide:1,m2:2,sata:4,u2:0,lan:'2.5 GbE + Wi-Fi',inr:15500},
 {id:'asus-b650p',n:'ASUS TUF Gaming B650-PLUS WIFI',b:'ASUS',p:'AM5',chip:'B650',s:1,ff:'ATX',mem:'DDR5 UDIMM',dimm:4,max:256,x16:2,wide:2,m2:3,sata:4,u2:0,lan:'2.5 GbE + Wi-Fi',inr:19000,note:'Second x16 slot is electrically x4: fine for a second card, not full speed.'},
 {id:'asus-x870p',n:'ASUS TUF Gaming X870-PLUS WIFI',b:'ASUS',p:'AM5',chip:'X870',s:1,ff:'ATX',mem:'DDR5 UDIMM',dimm:4,max:256,x16:2,wide:2,m2:4,sata:4,u2:0,lan:'2.5 GbE + Wi-Fi 7',inr:27500},
 {id:'asus-proart-x670e',n:'ASUS ProArt X670E-CREATOR WIFI',b:'ASUS',p:'AM5',chip:'X670E',s:1,ff:'ATX',mem:'DDR5 UDIMM',dimm:4,max:256,x16:2,wide:2,m2:4,sata:4,u2:0,lan:'10 GbE + 2.5 GbE',inr:46000,bif:1,note:'Two GPU slots run x8 + x8 from the CPU — the clean AM5 choice for two cards.'},
 {id:'msi-x870e-godlike',n:'MSI MEG X870E GODLIKE',b:'MSI',p:'AM5',chip:'X870E',s:1,ff:'E-ATX',mem:'DDR5 UDIMM',dimm:4,max:256,x16:2,wide:2,m2:4,sata:4,u2:0,lan:'10 GbE + 5 GbE',bif:1,inr:null,seen:[{p:104595,x:88640,mrp:290999}],note:'Enthusiast board. Slot and M.2 counts here are conservative — verify on msi.com.'},
 {id:'asrock-b650d4u',n:'ASRock Rack B650D4U',b:'ASRock Rack',p:'AM5',chip:'B650',s:1,ff:'mATX',mem:'DDR5 ECC UDIMM',dimm:4,max:192,x16:1,wide:1,m2:2,sata:4,u2:0,lan:'2 × 1 GbE + IPMI',bmc:1,inr:48000,ecc:1,note:'Server board for EPYC 4004 / Ryzen with ECC memory and remote management.'},
 {id:'ga-h610m',n:'Gigabyte H610M S2H DDR4',b:'Gigabyte',p:'LGA1700',chip:'H610',s:1,ff:'mATX',mem:'DDR4 UDIMM',dimm:2,max:64,x16:1,wide:1,m2:1,sata:4,u2:0,lan:'1 GbE',inr:6800,maxw:125},
 {id:'msi-b760m-d4',n:'MSI PRO B760M-A WIFI DDR4',b:'MSI',p:'LGA1700',chip:'B760',s:1,ff:'mATX',mem:'DDR4 UDIMM',dimm:4,max:128,x16:2,wide:1,m2:2,sata:4,u2:0,lan:'2.5 GbE + Wi-Fi',inr:13800},
 {id:'msi-b760m-d5',n:'MSI PRO B760M-A WIFI (DDR5)',b:'MSI',p:'LGA1700',chip:'B760',s:1,ff:'mATX',mem:'DDR5 UDIMM',dimm:4,max:192,x16:2,wide:1,m2:2,sata:4,u2:0,lan:'2.5 GbE + Wi-Fi',inr:14800},
 {id:'asus-z790p',n:'ASUS TUF Gaming Z790-PLUS WIFI',b:'ASUS',p:'LGA1700',chip:'Z790',s:1,ff:'ATX',mem:'DDR5 UDIMM',dimm:4,max:192,x16:2,wide:2,m2:4,sata:4,u2:0,lan:'2.5 GbE + Wi-Fi',inr:24500},
 {id:'msi-b860m',n:'MSI PRO B860M-A WIFI',b:'MSI',p:'LGA1851',chip:'B860',s:1,ff:'mATX',mem:'DDR5 UDIMM',dimm:4,max:256,x16:2,wide:1,m2:3,sata:4,u2:0,lan:'2.5 GbE + Wi-Fi',inr:17500},
 {id:'msi-z890a',n:'MSI PRO Z890-A WIFI',b:'MSI',p:'LGA1851',chip:'Z890',s:1,ff:'ATX',mem:'DDR5 UDIMM',dimm:4,max:256,x16:2,wide:2,m2:4,sata:4,u2:0,lan:'5 GbE + Wi-Fi 7',inr:28500},
 {id:'asus-x99',n:'X99 board (used market)',b:'Various',p:'LGA2011-3',chip:'X99',s:1,ff:'ATX',mem:'DDR4 UDIMM',dimm:8,max:128,x16:3,wide:2,m2:1,sata:8,u2:0,lan:'1 GbE',inr:null,cond:'used',note:'Exact model, condition and BIOS must be confirmed.'},
 {id:'sm-x10dri',n:'Supermicro X10DRi (used)',b:'Supermicro',p:'LGA2011-3',chip:'C612',s:2,ff:'E-ATX',mem:'DDR4 RDIMM',dimm:16,max:1024,x16:3,wide:2,m2:0,sata:10,u2:0,lan:'2 × 1 GbE + IPMI',bmc:1,inr:16000,cond:'used',ecc:1,note:'Used-market estimate. Two Xeon E5 v3/v4 sockets.'},
 {id:'asus-x299',n:'ASUS Prime X299-A II (used)',b:'ASUS',p:'LGA2066',chip:'X299',s:1,ff:'ATX',mem:'DDR4 UDIMM',dimm:8,max:256,x16:3,wide:2,m2:2,sata:6,u2:0,lan:'1 GbE',inr:null,cond:'used'},
 {id:'asus-x399',n:'X399 board (used market)',b:'Various',p:'TR4',chip:'X399',s:1,ff:'E-ATX',mem:'DDR4 UDIMM',dimm:8,max:128,x16:4,wide:2,m2:2,sata:6,u2:0,lan:'1 GbE',inr:null,cond:'used'},
 {id:'asus-trx50-sage',n:'ASUS Pro WS TRX50-SAGE WIFI',b:'ASUS',p:'TRX50',chip:'TRX50',s:1,ff:'CEB',mem:'DDR5 RDIMM',dimm:4,max:1024,x16:3,wide:3,m2:3,sata:4,u2:0,lan:'10 GbE + 2.5 GbE',inr:105000,ecc:1,note:'A newer "WIFI A" revision was seen on Amazon.in (price not visible in screenshot).'},
 {id:'ga-trx50-aero',n:'Gigabyte TRX50 AERO D',b:'Gigabyte',p:'TRX50',chip:'TRX50',s:1,ff:'E-ATX',mem:'DDR5 RDIMM',dimm:4,max:1024,x16:3,wide:2,m2:4,sata:4,u2:0,lan:'10 GbE + 2.5 GbE',inr:92000,ecc:1},
 {id:'asus-wrx80-sage',n:'ASUS Pro WS WRX80E-SAGE SE WIFI',b:'ASUS',p:'sWRX8',chip:'WRX80',s:1,ff:'EEB',mem:'DDR4 RDIMM',dimm:8,max:2048,x16:7,wide:4,m2:3,sata:8,u2:0,lan:'2 × 10 GbE',bmc:1,inr:110000,ecc:1},
 {id:'asus-wrx90-sage',n:'ASUS Pro WS WRX90E-SAGE SE',b:'ASUS',p:'WRX90',chip:'WRX90',s:1,ff:'EEB',mem:'DDR5 RDIMM',dimm:8,max:2048,x16:7,wide:4,m2:4,sata:4,u2:2,lan:'10 GbE + 10 GbE',bmc:1,inr:145000,ecc:1,url:'https://www.asus.com/in/motherboards-components/motherboards/workstation/pro-ws-wrx90e-sage-se/techspec/',note:'7 full PCIe 5.0 x16 slots; realistically 4 double-wide GPUs with blower or water cooling.'},
 {id:'asrock-wrx90-evo',n:'ASRock WRX90 WS EVO',b:'ASRock',p:'WRX90',chip:'WRX90',s:1,ff:'EEB',mem:'DDR5 RDIMM',dimm:8,max:2048,x16:7,wide:4,m2:4,sata:8,u2:2,lan:'2 × 10 GbE',bmc:1,inr:128000,ecc:1},
 {id:'asus-w790-sage',n:'ASUS Pro WS W790E-SAGE SE',b:'ASUS',p:'LGA4677',chip:'W790',s:1,ff:'EEB',mem:'DDR5 RDIMM',dimm:8,max:2048,x16:7,wide:4,m2:3,sata:8,u2:0,lan:'2 × 10 GbE',bmc:1,inr:135000,ecc:1,w790:1,note:'For Xeon W-2400/W-3400 workstation CPUs only.'},
 {id:'sm-x11dpi',n:'Supermicro X11DPi-N (used)',b:'Supermicro',p:'LGA3647',chip:'C621',s:2,ff:'E-ATX',mem:'DDR4 RDIMM',dimm:16,max:4096,x16:4,wide:2,m2:1,sata:14,u2:0,lan:'2 × 1 GbE + IPMI',bmc:1,inr:32000,cond:'used',ecc:1},
 {id:'sm-x13sei',n:'Supermicro X13SEI-TF',b:'Supermicro',p:'LGA4677',chip:'C741',s:1,ff:'ATX',mem:'DDR5 RDIMM',dimm:8,max:2048,x16:3,wide:2,m2:2,sata:10,u2:0,lan:'2 × 10 GbE + IPMI',bmc:1,inr:85000,ecc:1},
 {id:'sm-x13dei',n:'Supermicro X13DEI',b:'Supermicro',p:'LGA4677',chip:'C741',s:2,ff:'E-ATX',mem:'DDR5 RDIMM',dimm:16,max:4096,x16:4,wide:2,m2:1,sata:10,u2:0,lan:'2 × 10 GbE + IPMI',bmc:1,inr:150000,ecc:1},
 {id:'sm-h12ssl',n:'Supermicro H12SSL-i',b:'Supermicro',p:'SP3',chip:'SoC',s:1,ff:'ATX',mem:'DDR4 RDIMM',dimm:8,max:2048,x16:5,wide:3,m2:2,sata:8,u2:0,lan:'2 × 1 GbE + IPMI',bmc:1,inr:52000,ecc:1},
 {id:'sm-h11dsi',n:'Supermicro H11DSi (used)',b:'Supermicro',p:'SP3',chip:'SoC',s:2,ff:'E-ATX',mem:'DDR4 RDIMM',dimm:16,max:2048,x16:2,wide:2,m2:1,sata:10,u2:0,lan:'2 × 1 GbE + IPMI',bmc:1,inr:38000,cond:'used',ecc:1,note:'Rev 2.0 needed for EPYC 7002/7003 — confirm revision.'},
 {id:'asrock-sienad8',n:'ASRock Rack SIENAD8-2L2T',b:'ASRock Rack',p:'SP6',chip:'SoC',s:1,ff:'Deep mATX',mem:'DDR5 RDIMM',dimm:6,max:576,x16:2,wide:1,m2:2,sata:0,u2:4,lan:'2 × 10 GbE + IPMI',bmc:1,inr:70000,ecc:1},
 {id:'sm-h13ssl',n:'Supermicro H13SSL-N',b:'Supermicro',p:'SP5',chip:'SoC',s:1,ff:'ATX (12"×13")',mem:'DDR5 RDIMM',dimm:12,max:3072,x16:3,wide:2,m2:2,sata:8,u2:2,lan:'2 × 1 GbE + IPMI',bmc:1,inr:88000,ecc:1},
 {id:'ga-mz33',n:'Gigabyte MZ33-AR0',b:'Gigabyte',p:'SP5',chip:'SoC',s:1,ff:'E-ATX',mem:'DDR5 RDIMM',dimm:24,max:3072,x16:4,wide:2,m2:2,sata:0,u2:4,lan:'2 × 10 GbE + IPMI',bmc:1,inr:115000,ecc:1},
 {id:'ga-mz73',n:'Gigabyte MZ73-LM0',b:'Gigabyte',p:'SP5',chip:'SoC',s:2,ff:'E-ATX',mem:'DDR5 RDIMM',dimm:24,max:6144,x16:2,wide:2,m2:2,sata:0,u2:4,lan:'2 × 10 GbE + IPMI',bmc:1,inr:190000,ecc:1,note:'Dual SP5. 12 memory slots belong to each CPU.'},
 {id:'sm-h13dsh',n:'Supermicro H13DSH',b:'Supermicro',p:'SP5',chip:'SoC',s:2,ff:'Proprietary (2U/4U systems)',mem:'DDR5 RDIMM',dimm:24,max:6144,x16:4,wide:2,m2:2,sata:0,u2:4,lan:'via AIOM + IPMI',bmc:1,inr:null,ecc:1,oem:1,url:'https://www.supermicro.com/en/products/motherboard/h13dsh',note:'Sold inside Supermicro complete systems. Quotation required.'},
 {id:'oem-4s-3647',n:'4-socket Xeon Scalable system (OEM)',b:'OEM',p:'LGA3647',chip:'C620',s:4,ff:'OEM 2U/4U',mem:'DDR4 RDIMM',dimm:48,max:6144,x16:4,wide:2,m2:0,sata:0,u2:8,lan:'OEM',bmc:1,inr:null,ecc:1,oem:1,note:'Example class: Dell PowerEdge R940, HPE ProLiant DL560 Gen10. Complete system only.'},
 {id:'oem-8s-3647',n:'8-socket Xeon Platinum system (OEM)',b:'OEM',p:'LGA3647',chip:'C620',s:8,ff:'OEM multi-chassis',mem:'DDR4 RDIMM',dimm:96,max:12288,x16:8,wide:0,m2:0,sata:0,u2:8,lan:'OEM',bmc:1,inr:null,ecc:1,oem:1,note:'Example class: Lenovo ThinkSystem SR950, HPE Superdome Flex. Complete system only.'},
 {id:'oem-sp5-gpu8',n:'2-socket EPYC 4U GPU server (OEM, up to 8 GPUs)',b:'OEM',p:'SP5',chip:'SoC',s:2,ff:'OEM 2U/4U',mem:'DDR5 RDIMM',dimm:24,max:6144,x16:8,wide:8,m2:2,sata:0,u2:8,lan:'OEM + IPMI',bmc:1,inr:null,ecc:1,oem:1,note:'System class such as Supermicro AS-4125GS-TNRT, ASUS ESC8000A-E12 or Gigabyte G493: two EPYC sockets and up to 8 double-width graphics cards in one 4U chassis. Sold only as complete systems — quotation required. Needs a rack, 230 V circuits and room cooling.'},
 {id:'oem-x6-4710',n:'Xeon 6 dual-socket server (OEM)',b:'OEM',p:'LGA4710',chip:'SoC',s:2,ff:'OEM 1U/2U',mem:'DDR5 RDIMM',dimm:32,max:8192,x16:4,wide:2,m2:2,sata:0,u2:8,lan:'OEM',bmc:1,inr:null,ecc:1,oem:1},
 {id:'oem-x6-7529',n:'Xeon 6 6900-series server (OEM)',b:'OEM',p:'LGA7529',chip:'SoC',s:2,ff:'OEM 2U',mem:'DDR5 RDIMM',dimm:24,max:6144,x16:4,wide:2,m2:2,sata:0,u2:8,lan:'OEM',bmc:1,inr:null,ecc:1,oem:1}
];
const GPU=[
 {id:'none',n:'No separate graphics card',b:'—',vram:0,w:0,sl:0,gi:0,inr:0,tier:'Integrated',note:'Uses the processor\'s graphics or a server\'s management VGA.'},
 {id:'gt710',n:'NVIDIA GeForce GT 710 2 GB',b:'NVIDIA',vram:2,w:19,sl:1,gi:1,cuda:0,inr:3600,tier:'Display only',note:'Only gives a screen to CPUs without integrated graphics. Not for games or AI.'},
 {id:'arc-a380',n:'Intel Arc A380 6 GB',b:'Intel',vram:6,w:75,sl:2,gi:10,cuda:0,usd:139,inr:11500,tier:'Entry',note:'Good AV1 video encoder for little money.'},
 {id:'rtx3050-6',n:'NVIDIA GeForce RTX 3050 6 GB',b:'NVIDIA',vram:6,w:70,sl:2,gi:14,cuda:1,usd:169,inr:17500,tier:'Entry'},
 {id:'rtx5050',n:'NVIDIA GeForce RTX 5050 8 GB',b:'NVIDIA',vram:8,w:130,sl:2,gi:28,cuda:1,usd:249,inr:25500,tier:'Entry gaming'},
 {id:'arc-b580',n:'Intel Arc B580 12 GB',b:'Intel',vram:12,w:190,sl:2,gi:31,cuda:0,usd:249,inr:27000,tier:'Entry gaming'},
 {id:'rtx5060',n:'NVIDIA GeForce RTX 5060 8 GB',b:'NVIDIA',vram:8,w:145,sl:2,gi:33,cuda:1,usd:299,inr:29500,tier:'Mainstream'},
 {id:'rx9060xt',n:'AMD Radeon RX 9060 XT 16 GB',b:'AMD',vram:16,w:160,sl:2,gi:38,cuda:0,usd:349,inr:37000,tier:'Mainstream'},
 {id:'rtx5060ti16',n:'NVIDIA GeForce RTX 5060 Ti 16 GB',b:'NVIDIA',vram:16,w:180,sl:2,gi:40,cuda:1,usd:429,inr:47000,tier:'Mainstream',note:'Cheapest current NVIDIA card with 16 GB — a common entry point for local AI.'},
 {id:'rtx5070',n:'NVIDIA GeForce RTX 5070 12 GB',b:'NVIDIA',vram:12,w:250,sl:2.5,gi:55,cuda:1,usd:549,inr:57000,tier:'Performance'},
 {id:'rx9070',n:'AMD Radeon RX 9070 16 GB',b:'AMD',vram:16,w:220,sl:2.5,gi:58,cuda:0,usd:549,inr:56000,tier:'Performance'},
 {id:'rx9070xt',n:'AMD Radeon RX 9070 XT 16 GB',b:'AMD',vram:16,w:304,sl:3,gi:66,cuda:0,usd:599,inr:63000,tier:'Performance'},
 {id:'rtx3090u',n:'NVIDIA GeForce RTX 3090 24 GB (used)',b:'NVIDIA',vram:24,w:350,sl:3,gi:55,cuda:1,inr:72000,tier:'Used',cond:'used',note:'Used-market estimate. Cheapest route to 24 GB for AI. Check mining history, fans and warranty.'},
 {id:'rtx5070ti',n:'NVIDIA GeForce RTX 5070 Ti 16 GB',b:'NVIDIA',vram:16,w:300,sl:3,gi:70,cuda:1,usd:749,inr:82000,tier:'High'},
 {id:'rx7900xtx',n:'AMD Radeon RX 7900 XTX 24 GB',b:'AMD',vram:24,w:355,sl:3,gi:80,cuda:0,usd:999,inr:96000,tier:'High'},
 {id:'rtx5080',n:'NVIDIA GeForce RTX 5080 16 GB',b:'NVIDIA',vram:16,w:360,sl:3,gi:80,cuda:1,usd:999,inr:112000,tier:'High'},
 {id:'rtx4090',n:'NVIDIA GeForce RTX 4090 24 GB',b:'NVIDIA',vram:24,w:450,sl:3.5,gi:100,cuda:1,usd:1599,inr:null,tier:'Previous flagship',note:'Discontinued; remaining stock is often priced above the RTX 5090.'},
 {id:'rtx5090',n:'NVIDIA GeForce RTX 5090 32 GB',b:'NVIDIA',vram:32,w:575,sl:3.5,gi:130,cuda:1,usd:1999,inr:275000,tier:'Flagship',note:'575 W on one 12V-2x6 connector. Needs a strong PSU, good airflow and careful cabling.'},
 {id:'rtx-a2000',n:'NVIDIA RTX A2000 12 GB',b:'NVIDIA',vram:12,w:70,sl:2,gi:18,cuda:1,pro:1,inr:58000,tier:'Workstation',note:'Low-profile, certified drivers for CAD.'},
 {id:'rtx4000ada',n:'NVIDIA RTX 4000 Ada 20 GB',b:'NVIDIA',vram:20,w:130,sl:1,gi:36,cuda:1,pro:1,usd:1250,inr:140000,tier:'Workstation',note:'Single-slot: several fit side by side.'},
 {id:'rtxpro4000',n:'NVIDIA RTX PRO 4000 Blackwell 24 GB',b:'NVIDIA',vram:24,w:140,sl:1,gi:50,cuda:1,pro:1,inr:165000,tier:'Workstation'},
 {id:'w7900',n:'AMD Radeon PRO W7900 48 GB',b:'AMD',vram:48,w:295,sl:3,gi:72,cuda:0,pro:1,usd:3999,inr:390000,tier:'Workstation'},
 {id:'rtxpro5000',n:'NVIDIA RTX PRO 5000 Blackwell 48 GB',b:'NVIDIA',vram:48,w:300,sl:2,gi:95,cuda:1,pro:1,inr:470000,tier:'Workstation'},
 {id:'rtx6000ada',n:'NVIDIA RTX 6000 Ada 48 GB',b:'NVIDIA',vram:48,w:300,sl:2,gi:95,cuda:1,pro:1,usd:6800,inr:650000,tier:'Workstation'},
 {id:'rtxpro6000',n:'NVIDIA RTX PRO 6000 Blackwell 96 GB',b:'NVIDIA',vram:96,w:600,sl:2,gi:135,cuda:1,pro:1,inr:960000,tier:'Workstation',note:'Max-Q (300 W) and Server (passive) editions also exist — choose by chassis cooling.'},
 {id:'l40s',n:'NVIDIA L40S 48 GB (server)',b:'NVIDIA',vram:48,w:350,sl:2,gi:95,cuda:1,pas:1,pro:1,inr:null,tier:'Data centre',note:'Passive cooling: only in servers with front-to-back airflow.'},
 {id:'h100pcie',n:'NVIDIA H100 NVL 94 GB (server)',b:'NVIDIA',vram:94,w:400,sl:2,gi:160,cuda:1,pas:1,pro:1,inr:null,tier:'Data centre',note:'Passive. Qualified servers only.'},
 {id:'h200nvl',n:'NVIDIA H200 NVL 141 GB (server)',b:'NVIDIA',vram:141,w:600,sl:2,gi:190,cuda:1,pas:1,pro:1,inr:null,tier:'Data centre'},
 {id:'b200',n:'NVIDIA B200 (HGX 8-GPU systems only)',b:'NVIDIA',vram:180,w:1000,sl:0,gi:400,cuda:1,sys:1,pro:1,inr:null,tier:'Data centre system',note:'SXM module. Not a card: bought as an 8-GPU server.'},
 {id:'mi300x',n:'AMD Instinct MI300X (8-GPU platforms only)',b:'AMD',vram:192,w:750,sl:0,gi:300,cuda:0,sys:1,pro:1,inr:null,tier:'Data centre system',note:'OAM module inside complete 8-GPU servers.'}
];
const RAMT={
 'DDR4 UDIMM':{sizes:[8,16,32],gb:330,ex:'Kingston FURY Beast / Crucial DDR4-3200'},
 'DDR5 UDIMM':{sizes:[8,16,24,32,48,64],gb:560,ex:'Kingston FURY / Crucial DDR5-5600'},
 'DDR5 ECC UDIMM':{sizes:[16,32,48],gb:780,ex:'Kingston Server Premier DDR5 ECC UDIMM'},
 'DDR5 RDIMM':{sizes:[16,32,64,96,128,256],gb:900,ex:'Samsung / Micron / SK hynix DDR5-4800+ RDIMM'},
 'DDR4 RDIMM':{sizes:[16,32,64,128],gb:280,ex:'Samsung / Micron DDR4-2933/3200 RDIMM (often used)'}
};
const SSD=[
 {id:'nv3-500',n:'Kingston NV3 500 GB',b:'Kingston',ff:'M.2',bus:'PCIe 4.0',tb:.5,nand:'TLC/QLC (varies)',dram:'HMB',tbw:160,r:5000,inr:3600,tier:'Budget',note:'NAND type can change between batches. Fine for office.'},
 {id:'mx500-1',n:'Crucial MX500 1 TB (SATA)',b:'Crucial',ff:'2.5" SATA',bus:'SATA',tb:1,nand:'TLC',dram:'DRAM',tbw:360,r:560,inr:6800,tier:'SATA',note:'For older boards or extra bays.'},
 {id:'p3plus-1',n:'Crucial P3 Plus 1 TB',b:'Crucial',ff:'M.2',bus:'PCIe 4.0',tb:1,nand:'QLC',dram:'none',tbw:220,r:5000,inr:6600,tier:'Budget',note:'QLC: fast at first, slower on long copies.'},
 {id:'sn770-1',n:'WD Black SN770 1 TB',b:'WD',ff:'M.2',bus:'PCIe 4.0',tb:1,nand:'TLC',dram:'HMB',tbw:600,r:5150,inr:7400,tier:'Mainstream'},
 {id:'990pro-1',n:'Samsung 990 PRO 1 TB',b:'Samsung',ff:'M.2',bus:'PCIe 4.0',tb:1,nand:'TLC',dram:'DRAM',tbw:600,r:7450,inr:10500,tier:'Performance'},
 {id:'sn770-2',n:'WD Black SN770 2 TB',b:'WD',ff:'M.2',bus:'PCIe 4.0',tb:2,nand:'TLC',dram:'HMB',tbw:1200,r:5150,inr:12800,tier:'Mainstream'},
 {id:'990evop-2',n:'Samsung 990 EVO Plus 2 TB',b:'Samsung',ff:'M.2',bus:'PCIe 4.0 x4 / 5.0 x2',tb:2,nand:'TLC',dram:'HMB',tbw:1200,r:7250,inr:14000,tier:'Mainstream'},
 {id:'990pro-2',n:'Samsung 990 PRO 2 TB',b:'Samsung',ff:'M.2',bus:'PCIe 4.0',tb:2,nand:'TLC',dram:'DRAM',tbw:1200,r:7450,inr:18500,tier:'Performance'},
 {id:'t705-2',n:'Crucial T705 2 TB',b:'Crucial',ff:'M.2',bus:'PCIe 5.0',tb:2,nand:'TLC',dram:'DRAM',tbw:1200,r:14500,inr:29000,tier:'Gen5',note:'Gen5 speed needs a Gen5 slot and real cooling.'},
 {id:'990pro-4',n:'Samsung 990 PRO 4 TB',b:'Samsung',ff:'M.2',bus:'PCIe 4.0',tb:4,nand:'TLC',dram:'DRAM',tbw:2400,r:7450,inr:35500,tier:'Performance',url:'https://semiconductor.samsung.com/news-events/news/samsung-electronics-4tb-ssd-990-pro-series-brings-ultimate-performance-and-capacity-for-gamers-and-creators/'},
 {id:'990pro-4hs',n:'Samsung 990 PRO 4 TB with heatsink',b:'Samsung',ff:'M.2',bus:'PCIe 4.0',tb:4,nand:'TLC',dram:'DRAM',tbw:2400,r:7450,hs:1,inr:38500,tier:'Performance',note:'Same drive as the one above plus a heatsink. Not faster on paper; may not fit under a board\'s own M.2 cover.'},
 {id:'9100pro-4',n:'Samsung 9100 PRO 4 TB',b:'Samsung',ff:'M.2',bus:'PCIe 5.0',tb:4,nand:'TLC',dram:'DRAM',tbw:2400,r:14800,inr:62000,tier:'Gen5'},
 {id:'pm9a3-3.84',n:'Samsung PM9A3 3.84 TB (U.2)',b:'Samsung',ff:'U.2',bus:'PCIe 4.0',tb:3.84,nand:'TLC',dram:'DRAM',tbw:7008,dwpd:1,plp:1,r:6900,inr:72000,tier:'Enterprise',note:'Power-loss protection and 1 drive-write-per-day endurance for 5 years.'},
 {id:'m7450-7.68',n:'Micron 7450 PRO 7.68 TB (U.3)',b:'Micron',ff:'U.3',bus:'PCIe 4.0',tb:7.68,nand:'TLC',dram:'DRAM',tbw:14000,dwpd:1,plp:1,r:6800,inr:140000,tier:'Enterprise'},
 {id:'p5336-61',n:'Solidigm D5-P5336 61.44 TB (U.2)',b:'Solidigm',ff:'U.2',bus:'PCIe 4.0',tb:61.44,nand:'QLC',dram:'DRAM',plp:1,r:7000,inr:null,tier:'Enterprise capacity',note:'Huge read-mostly capacity. Low write endurance per TB. Quotation required.'},
 {id:'ironwolf-12',n:'Seagate IronWolf Pro 12 TB (HDD)',b:'Seagate',ff:'3.5" SATA',bus:'SATA',tb:12,nand:'Hard disk',dram:'—',r:250,inr:30000,tier:'Archive',note:'Cheap per TB for backups and archives; slow for active work.'},
 {id:'exos-20',n:'Seagate Exos X20 20 TB (HDD)',b:'Seagate',ff:'3.5" SATA',bus:'SATA',tb:20,nand:'Hard disk',dram:'—',r:270,inr:46000,tier:'Archive'}
];
const PSU=[
 {id:'psu-450',n:'Deepcool PK450D 450 W (80+ Bronze)',w:450,eff:'Bronze',inr:3300},
 {id:'psu-550',n:'Deepcool PK550D 550 W (80+ Bronze)',w:550,eff:'Bronze',inr:4200},
 {id:'psu-650',n:'Corsair RM650e 650 W (80+ Gold)',w:650,eff:'Gold',inr:7600},
 {id:'psu-850',n:'Corsair RM850e 850 W (80+ Gold, ATX 3.1)',w:850,eff:'Gold',inr:10800},
 {id:'psu-1000',n:'MSI MAG A1000GL 1000 W (80+ Gold, ATX 3.0)',w:1000,eff:'Gold',inr:14000},
 {id:'psu-1300',n:'Corsair HX1300i-class 1300 W (80+ Platinum)',w:1300,eff:'Platinum',inr:24000},
 {id:'psu-1600',n:'Seasonic PRIME TX-1600 (80+ Titanium)',w:1600,eff:'Titanium',inr:46000},
 {id:'psu-red2000',n:'Redundant 2000 W server PSUs (pair, in chassis)',w:2000,eff:'Titanium',inr:null,server:1,note:'Comes with the server chassis. Needs a dedicated 230 V circuit.'},
 {id:'psu-red3000',n:'Redundant 3000 W+ server PSUs (OEM)',w:3000,eff:'Titanium',inr:null,server:1}
];
const COOLER=[
 {id:'cool-box',n:'Cooler included with the processor',cap:88,inr:0,note:'Only for processors sold with a cooler in the box.'},
 {id:'cool-ak400',n:'Deepcool AK400 tower',cap:150,inr:2900},
 {id:'cool-ak620',n:'Deepcool AK620 dual tower',cap:200,inr:5900},
 {id:'cool-lf3-360',n:'Arctic Liquid Freezer III 360 (liquid)',cap:260,inr:10500,liquid:1},
 {id:'cool-nh-tr5',n:'Noctua NH-U14S TR5-SP6 (Threadripper / EPYC)',cap:350,inr:12800,big:1},
 {id:'cool-srv',n:'Server heatsink (per CPU, in chassis airflow)',cap:500,inr:6500,server:1}
];
const CASES=[
 {id:'case-matx',n:'Budget mATX cabinet (Ant Esports / Zebronics class)',ff:['mATX','Mini-ITX'],gpus:1,len:300,inr:2600},
 {id:'case-216',n:'Lian Li LANCOOL 216',ff:['ATX','mATX','Mini-ITX','E-ATX'],gpus:2,len:392,inr:8800},
 {id:'case-xl',n:'Fractal Design Define 7 XL',ff:['EEB','E-ATX','CEB','ATX','mATX','ATX (12"×13")','Deep mATX'],gpus:3,len:491,inr:21000},
 {id:'case-pro2',n:'Phanteks Enthoo Pro 2 Server Edition',ff:['EEB','E-ATX','CEB','ATX','mATX','ATX (12"×13")','Deep mATX'],gpus:4,len:503,inr:15500},
 {id:'case-4u',n:'4U rackmount chassis (SSI-EEB class)',ff:['EEB','E-ATX','CEB','ATX','ATX (12"×13")','Deep mATX','mATX'],gpus:4,len:400,inr:32000,rack:1},
 {id:'case-oem',n:'OEM server chassis (comes with the system)',ff:['Proprietary (2U/4U systems)','OEM 2U/4U','OEM multi-chassis','OEM 1U/2U','OEM 2U'],gpus:8,len:400,inr:null,rack:1,oem:1}
];
const OS=[
 {id:'os-none',n:'Not included',inr:0},
 {id:'os-linux',n:'Linux (Ubuntu / Fedora)',inr:0},
 {id:'os-win-home',n:'Windows 11 Home licence',inr:null,usd:139,note:'Microsoft US list price US$139 shown converted; Indian retail/OEM price to be confirmed.'},
 {id:'os-win-pro',n:'Windows 11 Pro licence',inr:null,usd:199,note:'Microsoft US list price US$199 shown converted; Indian retail/OEM price to be confirmed.'}
];
const COOLER_FIT={'cool-box':null,'cool-ak400':['AM4','AM5','LGA1700','LGA1851'],'cool-ak620':['AM4','AM5','LGA1700','LGA1851','LGA2066','LGA2011-3'],'cool-lf3-360':['AM4','AM5','LGA1700','LGA1851'],'cool-nh-tr5':['TRX50','WRX90','SP5','SP6'],'cool-nh-sp3':['TR4','sWRX8','SP3'],'cool-nh-4677':['LGA4677'],'cool-srv':['LGA2011-3','LGA3647','LGA4677','SP3','SP5','SP6','LGA4710','LGA7529','AM5']};
const CHANNELS={'AM4':2,'AM5':2,'LGA1700':2,'LGA1851':2,'LGA2066':4,'LGA2011-3':4,'TR4':4,'sWRX8':8,'TRX50':4,'WRX90':8,'SP3':8,'SP5':12,'SP6':6,'LGA3647':6,'LGA4677':8,'LGA4710':8,'LGA7529':12};
COOLER.push({id:'cool-nh-sp3',n:'Noctua NH-U14S TR4-SP3 (TR4 / sWRX8 / SP3)',cap:280,inr:7800,big:1},{id:'cool-nh-4677',n:'Noctua NH-U14S DX-4677 (Xeon W / Scalable)',cap:350,inr:9800,big:1});

/* ---------------------------------------------------------------- Part 2: added 01-11-2026 for the simple builder */
GPU.push(
 {id:'rtx3060-12',n:'NVIDIA GeForce RTX 3060 12 GB',b:'NVIDIA',vram:12,w:170,sl:2,gi:25,cuda:1,usd:329,inr:26500,tier:'Entry',note:'Older card, but 12 GB of memory keeps it useful for small AI models.'},
 {id:'rtx4060',n:'NVIDIA GeForce RTX 4060 8 GB',b:'NVIDIA',vram:8,w:115,sl:2,gi:30,cuda:1,usd:299,inr:28500,tier:'Mainstream'},
 {id:'rtx4060ti16',n:'NVIDIA GeForce RTX 4060 Ti 16 GB',b:'NVIDIA',vram:16,w:165,sl:2,gi:36,cuda:1,usd:499,inr:45000,tier:'Mainstream'},
 {id:'rtx5060ti8',n:'NVIDIA GeForce RTX 5060 Ti 8 GB',b:'NVIDIA',vram:8,w:180,sl:2,gi:38,cuda:1,usd:379,inr:38500,tier:'Mainstream'},
 {id:'rtx4070s',n:'NVIDIA GeForce RTX 4070 SUPER 12 GB',b:'NVIDIA',vram:12,w:220,sl:2.5,gi:52,cuda:1,usd:599,inr:58000,tier:'Performance'},
 {id:'rtx4070tis',n:'NVIDIA GeForce RTX 4070 Ti SUPER 16 GB',b:'NVIDIA',vram:16,w:285,sl:3,gi:64,cuda:1,usd:799,inr:78000,tier:'High'},
 {id:'rtx4080s',n:'NVIDIA GeForce RTX 4080 SUPER 16 GB',b:'NVIDIA',vram:16,w:320,sl:3,gi:78,cuda:1,usd:999,inr:105000,tier:'High'},
 {id:'arc-b570',n:'Intel Arc B570 10 GB',b:'Intel',vram:10,w:150,sl:2,gi:26,cuda:0,usd:219,inr:22500,tier:'Entry gaming'},
 {id:'arc-a770',n:'Intel Arc A770 16 GB',b:'Intel',vram:16,w:225,sl:2,gi:28,cuda:0,usd:329,inr:30000,tier:'Entry gaming'},
 {id:'rx7600',n:'AMD Radeon RX 7600 8 GB',b:'AMD',vram:8,w:165,sl:2,gi:27,cuda:0,usd:269,inr:25500,tier:'Entry gaming'},
 {id:'rx7700xt',n:'AMD Radeon RX 7700 XT 12 GB',b:'AMD',vram:12,w:245,sl:2.5,gi:42,cuda:0,usd:449,inr:40000,tier:'Mainstream'},
 {id:'rx7800xt',n:'AMD Radeon RX 7800 XT 16 GB',b:'AMD',vram:16,w:263,sl:2.5,gi:50,cuda:0,usd:499,inr:49000,tier:'Performance'},
 {id:'rx7900gre',n:'AMD Radeon RX 7900 GRE 16 GB',b:'AMD',vram:16,w:260,sl:2.5,gi:55,cuda:0,usd:549,inr:54000,tier:'Performance'},
 {id:'rx7900xt',n:'AMD Radeon RX 7900 XT 20 GB',b:'AMD',vram:20,w:315,sl:3,gi:66,cuda:0,usd:899,inr:72000,tier:'High'},
 {id:'rtx2000ada',n:'NVIDIA RTX 2000 Ada 16 GB',b:'NVIDIA',vram:16,w:70,sl:2,gi:22,cuda:1,pro:1,usd:625,inr:72000,tier:'Workstation',note:'Low power, small, certified drivers for CAD.'},
 {id:'rtx4500ada',n:'NVIDIA RTX 4500 Ada 24 GB',b:'NVIDIA',vram:24,w:210,sl:2,gi:58,cuda:1,pro:1,usd:2250,inr:235000,tier:'Workstation'},
 {id:'rtx5000ada',n:'NVIDIA RTX 5000 Ada 32 GB',b:'NVIDIA',vram:32,w:250,sl:2,gi:78,cuda:1,pro:1,usd:4000,inr:410000,tier:'Workstation'},
 {id:'rtxpro6000mq',n:'NVIDIA RTX PRO 6000 Blackwell Max-Q 96 GB',b:'NVIDIA',vram:96,w:300,sl:2,gi:120,cuda:1,pro:1,inr:960000,tier:'Workstation',note:'300 W blower edition: the one to use when four cards sit side by side.'}
);
SSD.push(
 {id:'p310-1',n:'Crucial P310 1 TB',b:'Crucial',ff:'M.2',bus:'PCIe 4.0',tb:1,nand:'QLC',dram:'HMB',tbw:220,r:7100,inr:6900,tier:'Budget'},
 {id:'nv3-1',n:'Kingston NV3 1 TB',b:'Kingston',ff:'M.2',bus:'PCIe 4.0',tb:1,nand:'TLC/QLC (varies)',dram:'HMB',tbw:320,r:6000,inr:6200,tier:'Budget'},
 {id:'990evop-1',n:'Samsung 990 EVO Plus 1 TB',b:'Samsung',ff:'M.2',bus:'PCIe 4.0 x4 / 5.0 x2',tb:1,nand:'TLC',dram:'HMB',tbw:600,r:7150,inr:8800,tier:'Mainstream'},
 {id:'sn850x-1',n:'WD Black SN850X 1 TB',b:'WD',ff:'M.2',bus:'PCIe 4.0',tb:1,nand:'TLC',dram:'DRAM',tbw:600,r:7300,inr:9800,tier:'Performance'},
 {id:'870evo-1',n:'Samsung 870 EVO 1 TB (SATA)',b:'Samsung',ff:'2.5" SATA',bus:'SATA',tb:1,nand:'TLC',dram:'DRAM',tbw:600,r:560,inr:8400,tier:'SATA'},
 {id:'nv3-2',n:'Kingston NV3 2 TB',b:'Kingston',ff:'M.2',bus:'PCIe 4.0',tb:2,nand:'TLC/QLC (varies)',dram:'HMB',tbw:640,r:6000,inr:11800,tier:'Budget'},
 {id:'t500-2',n:'Crucial T500 2 TB',b:'Crucial',ff:'M.2',bus:'PCIe 4.0',tb:2,nand:'TLC',dram:'HMB',tbw:1200,r:7400,inr:15500,tier:'Mainstream'},
 {id:'sn850x-2',n:'WD Black SN850X 2 TB',b:'WD',ff:'M.2',bus:'PCIe 4.0',tb:2,nand:'TLC',dram:'DRAM',tbw:1200,r:7300,inr:17500,tier:'Performance'},
 {id:'9100pro-2',n:'Samsung 9100 PRO 2 TB',b:'Samsung',ff:'M.2',bus:'PCIe 5.0',tb:2,nand:'TLC',dram:'DRAM',tbw:1200,r:14700,inr:29500,tier:'Gen5'},
 {id:'990evop-4',n:'Samsung 990 EVO Plus 4 TB',b:'Samsung',ff:'M.2',bus:'PCIe 4.0 x4 / 5.0 x2',tb:4,nand:'TLC',dram:'HMB',tbw:2400,r:7250,inr:29000,tier:'Mainstream'},
 {id:'sn850x-4',n:'WD Black SN850X 4 TB',b:'WD',ff:'M.2',bus:'PCIe 4.0',tb:4,nand:'TLC',dram:'DRAM',tbw:2400,r:7300,inr:34000,tier:'Performance'},
 {id:'t705-4',n:'Crucial T705 4 TB',b:'Crucial',ff:'M.2',bus:'PCIe 5.0',tb:4,nand:'TLC',dram:'DRAM',tbw:2400,r:14500,inr:56000,tier:'Gen5'},
 {id:'sn850x-8',n:'WD Black SN850X 8 TB',b:'WD',ff:'M.2',bus:'PCIe 4.0',tb:8,nand:'TLC',dram:'DRAM',tbw:4800,r:7200,inr:72000,tier:'Performance'},
 {id:'9100pro-8',n:'Samsung 9100 PRO 8 TB',b:'Samsung',ff:'M.2',bus:'PCIe 5.0',tb:8,nand:'TLC',dram:'DRAM',tbw:4800,r:14800,inr:135000,tier:'Gen5'},
 {id:'m9550-15',n:'Micron 9550 PRO 15.36 TB (U.2)',b:'Micron',ff:'U.2',bus:'PCIe 5.0',tb:15.36,nand:'TLC',dram:'DRAM',dwpd:1,plp:1,r:14000,inr:null,tier:'Enterprise',note:'Data-centre drive with power-loss protection. Quotation required.'},
 {id:'barracuda-2',n:'Seagate BarraCuda 2 TB (HDD)',b:'Seagate',ff:'3.5" SATA',bus:'SATA',tb:2,nand:'Hard disk',dram:'—',r:220,inr:6200,tier:'Archive'},
 {id:'redplus-4',n:'WD Red Plus 4 TB (NAS HDD)',b:'WD',ff:'3.5" SATA',bus:'SATA',tb:4,nand:'Hard disk',dram:'—',r:180,inr:10800,tier:'Archive'},
 {id:'exos-24',n:'Seagate Exos X24 24 TB (HDD)',b:'Seagate',ff:'3.5" SATA',bus:'SATA',tb:24,nand:'Hard disk',dram:'—',r:285,inr:56000,tier:'Archive'}
);
PSU.push(
 {id:'psu-2200',n:'Seasonic PRIME PX-2200 2200 W (80+ Platinum)',w:2200,eff:'Platinum',inr:58000,note:'Needs a 16 A socket on its own circuit.'},
 {id:'psu-750',n:'Corsair RM750e 750 W (80+ Gold, ATX 3.1)',w:750,eff:'Gold',inr:9200},
 {id:'psu-1200',n:'Corsair HX1200i 1200 W (80+ Platinum)',w:1200,eff:'Platinum',inr:22000}
);
PSU.sort((a,b)=>a.w-b.w);
COOLER.push(
 {id:'cool-ak500',n:'Deepcool AK500 single tower',cap:180,inr:4300},
 {id:'cool-nhd15g2',n:'Noctua NH-D15 G2 dual tower',cap:250,inr:14500},
 {id:'cool-lf3-420',n:'Arctic Liquid Freezer III 420 (liquid)',cap:300,inr:13500,liquid:1}
);
Object.assign(COOLER_FIT,{'cool-ak500':['AM4','AM5','LGA1700','LGA1851'],'cool-nhd15g2':['AM4','AM5','LGA1700','LGA1851'],'cool-lf3-420':['AM4','AM5','LGA1700','LGA1851']});
CASES.push(
 {id:'case-h5',n:'NZXT H5 Flow',ff:['ATX','mATX','Mini-ITX'],gpus:1,len:365,inr:8200},
 {id:'case-5000d',n:'Corsair 5000D Airflow',ff:['E-ATX','ATX','mATX','Mini-ITX'],gpus:2,len:420,inr:15500},
 {id:'case-o11',n:'Lian Li O11 Dynamic EVO XL',ff:['E-ATX','ATX','mATX','Mini-ITX'],gpus:2,len:460,inr:19500}
);

/* Memory kits. Each line: type, modules, GB per module, speed (MT/s), example kit we name in the shop links.
   Price = our estimate: GB x the rupee rate per GB of that memory type (RAMT above), plus a small step for faster
   kits and for very large modules. Memory prices moved a lot in 2026 - ask for a fresh quote. */
const RAM=[];
(function(){
 const K=[
  ['DDR4 UDIMM',1,8,3200,'Kingston FURY Beast DDR4-3200'],['DDR4 UDIMM',1,16,3200,'Crucial DDR4-3200'],['DDR4 UDIMM',2,8,3200,'Kingston FURY Beast DDR4-3200'],
  ['DDR4 UDIMM',2,16,3200,'Corsair Vengeance LPX DDR4-3200'],['DDR4 UDIMM',2,16,3600,'G.Skill Ripjaws V DDR4-3600'],['DDR4 UDIMM',2,32,3200,'Corsair Vengeance LPX DDR4-3200'],
  ['DDR4 UDIMM',4,16,3600,'G.Skill Ripjaws V DDR4-3600'],['DDR4 UDIMM',4,32,3200,'Corsair Vengeance LPX DDR4-3200'],
  ['DDR5 UDIMM',1,16,5600,'Crucial DDR5-5600'],['DDR5 UDIMM',2,8,5600,'Kingston FURY Beast DDR5-5600'],['DDR5 UDIMM',2,16,5600,'Kingston FURY Beast DDR5-5600'],
  ['DDR5 UDIMM',2,16,6000,'G.Skill Trident Z5 Neo DDR5-6000 CL30'],['DDR5 UDIMM',2,24,6000,'Corsair Vengeance DDR5-6000'],['DDR5 UDIMM',2,32,6000,'G.Skill Trident Z5 Neo DDR5-6000 CL30'],
  ['DDR5 UDIMM',2,32,6400,'Corsair Dominator Titanium DDR5-6400'],['DDR5 UDIMM',2,16,8000,'G.Skill Trident Z5 CK DDR5-8000 (CUDIMM)'],['DDR5 UDIMM',2,48,6000,'Corsair Vengeance DDR5-6000'],
  ['DDR5 UDIMM',4,32,5600,'Kingston FURY Beast DDR5-5600'],['DDR5 UDIMM',2,64,5600,'Crucial Pro DDR5-5600'],['DDR5 UDIMM',4,48,5600,'Corsair Vengeance DDR5-5600'],['DDR5 UDIMM',4,64,5600,'Crucial Pro DDR5-5600'],
  ['DDR5 ECC UDIMM',2,16,5600,'Kingston Server Premier DDR5 ECC UDIMM'],['DDR5 ECC UDIMM',2,32,5600,'Kingston Server Premier DDR5 ECC UDIMM'],['DDR5 ECC UDIMM',4,32,5600,'Kingston Server Premier DDR5 ECC UDIMM'],['DDR5 ECC UDIMM',4,48,5600,'Kingston Server Premier DDR5 ECC UDIMM'],
  ['DDR5 RDIMM',4,16,5600,'Samsung / Micron DDR5-5600 RDIMM'],['DDR5 RDIMM',4,32,5600,'Kingston / Samsung DDR5-5600 RDIMM'],['DDR5 RDIMM',8,16,5600,'Samsung / Micron DDR5-5600 RDIMM'],
  ['DDR5 RDIMM',4,64,5600,'Samsung / Micron DDR5-5600 RDIMM'],['DDR5 RDIMM',8,32,5600,'Samsung / SK hynix DDR5-5600 RDIMM'],['DDR5 RDIMM',12,32,5600,'Samsung / SK hynix DDR5-5600 RDIMM'],
  ['DDR5 RDIMM',8,64,5600,'Samsung / Micron DDR5-5600 RDIMM'],['DDR5 RDIMM',12,64,6400,'Micron / SK hynix DDR5-6400 RDIMM'],['DDR5 RDIMM',8,96,5600,'Micron DDR5-5600 RDIMM'],
  ['DDR5 RDIMM',8,128,5600,'Samsung / Micron DDR5-5600 RDIMM'],['DDR5 RDIMM',12,96,6400,'Micron DDR5-6400 RDIMM'],['DDR5 RDIMM',12,128,6400,'Samsung / Micron DDR5-6400 RDIMM'],
  ['DDR5 RDIMM',24,64,6400,'Micron / SK hynix DDR5-6400 RDIMM'],['DDR5 RDIMM',16,128,6400,'Samsung / Micron DDR5-6400 RDIMM'],['DDR5 RDIMM',8,256,6400,'Samsung / SK hynix DDR5-6400 3DS RDIMM'],['DDR5 RDIMM',24,128,6400,'Samsung / Micron DDR5-6400 RDIMM'],['DDR5 RDIMM',12,256,6400,'Samsung / SK hynix DDR5-6400 3DS RDIMM'],
  ['DDR5 RDIMM',24,256,6400,'Samsung / SK hynix DDR5-6400 3DS RDIMM'],
  ['DDR4 RDIMM',4,16,3200,'Samsung / Micron DDR4-3200 RDIMM'],['DDR4 RDIMM',8,16,3200,'Samsung / Micron DDR4-3200 RDIMM'],['DDR4 RDIMM',8,32,3200,'Samsung / SK hynix DDR4-3200 RDIMM'],
  ['DDR4 RDIMM',8,64,3200,'Samsung / Micron DDR4-3200 RDIMM'],['DDR4 RDIMM',16,32,3200,'Samsung / SK hynix DDR4-3200 RDIMM'],['DDR4 RDIMM',16,64,3200,'Samsung / Micron DDR4-3200 RDIMM'],
  ['DDR4 RDIMM',16,128,3200,'Samsung DDR4-3200 LRDIMM']
 ];
 const base={'DDR4 UDIMM':3200,'DDR5 UDIMM':5600,'DDR5 ECC UDIMM':5600,'DDR5 RDIMM':5600,'DDR4 RDIMM':3200};
 for(const [t,n,g,mts,ex] of K){
  const total=n*g, rate=RAMT[t].gb;
  const speedStep=1+Math.max(0,(mts-base[t]))/base[t]*0.9;     // faster kits cost a little more per GB
  const bigStep=g>=256?1.7:g>=128?1.25:g>=96?1.1:1;               // very large modules cost more per GB
  const inr=Math.round(total*rate*speedStep*bigStep/100)*100;
  const sz=total>=1024?(total/1024)+' TB':total+' GB';
  RAM.push({id:`ram-${t.replace(/\s+/g,'').toLowerCase()}-${n}x${g}-${mts}`,n:`${sz} ${t.replace(' UDIMM','')} (${n} × ${g} GB) ${mts} MT/s`,ex,type:t,mods:n,per:g,gb:total,mts,inr,ecc:/ECC|RDIMM/.test(t)?1:0});
 }
 RAM.sort((a,b)=>a.inr-b.inr);
})();
const AIMODELS=[
 {id:'llama32-3b',n:'Llama 3.2 3B',by:'Meta',p:3.2,kind:'llm',fam:1,use:'Chat on small machines, phones, quick summaries'},
 {id:'phi4-mini',n:'Phi-4-mini 3.8B',by:'Microsoft',p:3.8,kind:'llm',use:'Reasoning and maths on small machines'},
 {id:'gemma3-4b',n:'Gemma 3 4B',by:'Google',p:4,kind:'llm',use:'Chat, reads images too'},
 {id:'qwen3-8b',n:'Qwen3 8B',by:'Alibaba',p:8.2,kind:'llm',fam:1,use:'Strong small all-rounder, many languages incl. Hindi'},
 {id:'llama31-8b',n:'Llama 3.1 8B',by:'Meta',p:8,kind:'llm',fam:1,use:'Most-used small model; chat, RAG over your documents'},
 {id:'mistral-7b',n:'Mistral 7B',by:'Mistral AI',p:7.3,kind:'llm',use:'Fast small model'},
 {id:'gemma3-12b',n:'Gemma 3 12B',by:'Google',p:12,kind:'llm',use:'Chat with images, documents'},
 {id:'phi4-14b',n:'Phi-4 14B',by:'Microsoft',p:14,kind:'llm',use:'Reasoning, coding help'},
 {id:'gptoss-20b',n:'gpt-oss-20b',by:'OpenAI',p:21,act:3.6,q4:14,kind:'llm',fam:1,use:'OpenAI\'s open model for local use; reasoning, tools'},
 {id:'mistral-s24',n:'Mistral Small 3 24B',by:'Mistral AI',p:24,kind:'llm',use:'Good quality at medium size'},
 {id:'gemma3-27b',n:'Gemma 3 27B',by:'Google',p:27,kind:'llm',fam:1,use:'Best Google open model of its size'},
 {id:'qwen3-30b-a3b',n:'Qwen3 30B-A3B',by:'Alibaba',p:30.5,act:3.3,kind:'llm',use:'MoE: big-model quality at small-model speed'},
 {id:'qwen3-32b',n:'Qwen3 32B',by:'Alibaba',p:32.8,kind:'llm',fam:1,use:'Strong reasoning and coding'},
 {id:'r1-32b',n:'DeepSeek-R1-Distill-Qwen 32B',by:'DeepSeek',p:32.8,kind:'llm',use:'Step-by-step reasoning'},
 {id:'mixtral-8x7b',n:'Mixtral 8x7B',by:'Mistral AI',p:46.7,act:12.9,kind:'llm',use:'Older MoE, still popular'},
 {id:'llama33-70b',n:'Llama 3.3 70B',by:'Meta',p:70.6,kind:'llm',fam:1,use:'GPT-4-class answers at home; the classic "big local model"'},
 {id:'r1-70b',n:'DeepSeek-R1-Distill-Llama 70B',by:'DeepSeek',p:70.6,kind:'llm',use:'Reasoning at 70B'},
 {id:'llama4-scout',n:'Llama 4 Scout',by:'Meta',p:109,act:17,kind:'llm',use:'MoE with very long context'},
 {id:'gptoss-120b',n:'gpt-oss-120b',by:'OpenAI',p:117,act:5.1,q4:63,kind:'llm',fam:1,use:'OpenAI\'s large open model; made to fit one 80 GB GPU'},
 {id:'qwen3-235b',n:'Qwen3 235B-A22B',by:'Alibaba',p:235,act:22,kind:'llm',use:'Top open model class; needs a GPU server'},
 {id:'llama4-maverick',n:'Llama 4 Maverick',by:'Meta',p:400,act:17,kind:'llm',use:'Large MoE'},
 {id:'llama31-405b',n:'Llama 3.1 405B',by:'Meta',p:405,kind:'llm',use:'Largest dense Llama'},
 {id:'deepseek-r1',n:'DeepSeek-R1 671B',by:'DeepSeek',p:671,act:37,kind:'llm',fam:1,use:'World-famous open reasoning model; data-centre class'},
 {id:'kimi-k2',n:'Kimi K2 (1T)',by:'Moonshot AI',p:1000,act:32,kind:'llm',use:'Trillion-parameter MoE; GPU cluster class'},
 {id:'whisper-l3',n:'Whisper large-v3 (speech to text)',by:'OpenAI',p:1.55,kind:'speech',fam:1,minV:6,use:'Transcribe calls and meetings, Hindi and English'},
 {id:'sdxl',n:'Stable Diffusion XL (images)',by:'Stability AI',p:3.5,kind:'image',fam:1,minV:8,use:'Make images from text'},
 {id:'flux-dev',n:'FLUX.1 [dev] (images)',by:'Black Forest Labs',p:12,kind:'image',fam:1,minV:16,use:'High-quality images; 24 GB for full precision'},
 {id:'wan21-14b',n:'Wan 2.1 14B (video / avatars)',by:'Alibaba',p:14,kind:'video',minV:24,use:'Text-to-video, AI avatar clips (slow even on big GPUs)'}
];
for(const m of AIMODELS){if(m.q4==null)m.q4=+(m.p*.6+1.5).toFixed(1);m.q8=+(m.p*1.07+1.5).toFixed(1);m.fp16=+(m.p*2+2).toFixed(1)}
