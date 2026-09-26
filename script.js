const USERS_KEY ='mateobra_usuarios';

let usuarios = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
let usuarioActual = null;
let usuarioRecuperando = null;

function guardarUsuarios(){
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

const MENU = [
    { id:1, texto:"Calcular muro de ladrillo" },
    { id:2, texto:"Calcular viga de hormigón" },
    { id:3, texto:"Calcular columnas de hormigón" },
    { id:4, texto:"Calcular contrapisos" },
    { id:5, texto:"Calcular techo" },
    { id:6, texto:"Calcular pisos" },
    { id:7, texto:"Calcular pintura" },
    { id:8, texto:"Salir", exit:true }
];

function mostrarTab(cual){
    document.getElementById('tab-login').classList.toggle('active', cual==='login');
    document.getElementById('tab-registro').classList.toggle('active', cual==='registro');
    document.getElementById('form-login').style.display = cual==='login' ? 'block':'none';
    document.getElementById('form-registro').style.display = cual==='registro' ? 'block':'none';
    document.getElementById('form-recuperar1').style.display = cual === 'recuperar1' ? 'block' : 'none';
    document.getElementById('form-recuperar2').style.display = cual === 'recuperar2' ? 'block' : 'none';
}

function registrarUsuario(){
    const u = document.getElementById('reg-user').value.trim();
    const p = document.getElementById('reg-pass').value;
    const msg = document.getElementById('reg-msg');

    if(!u || !p){ msg.className='msg err'; msg.textContent='Completá usuario y contraseña.'; return; }
    if(p.length < 4){ msg.className='msg err'; msg.textContent='La contraseña necesita al menos 4 caracteres.'; return; }
    if(usuarios.some(x => x.usuario === u)){ msg.className='msg err'; msg.textContent='Ese usuario ya existe.'; return; }

    usuarios.push({ usuario:u, contrasena:p });
    guardarUsuarios();

    msg.className='msg ok'; msg.textContent='Cuenta creada. Ahora podés iniciar sesión.';
    document.getElementById('reg-user').value='';
    document.getElementById('reg-pass').value='';
    mostrarTab('login');
}

function iniciarSesion(){
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pass').value;
    const msg = document.getElementById('login-msg');
    const encontrado = usuarios.find(x => x.usuario === u && x.contrasena === p);
    if(!encontrado){ msg.className='msg err'; msg.textContent='Usuario o contraseña incorrectos.'; return; }
    usuarioActual = encontrado.usuario;
    cambiarPantalla('screen-menu');
    renderMenu();
}

function cerrarSesion(){
    usuarioActual = null;
    cambiarPantalla('screen-auth');
    mostrarTab('login');
}

function buscarUsuarioRecuperar(){
    const u = document.getElementById('rec-user').value.trim();
    const msg = document.getElementById('rec1-msg');
    const encontrado = usuarios.find(x => x.usuario === u);

    if(!encontrado){ msg.className='msg err'; msg.textContent='Ese usuario no existe.'; return; }

    usuarioRecuperando = u;
    msg.className='msg'; msg.textContent='';
    document.getElementById('rec-nueva').value = '';
    mostrarTab('recuperar2');
}

function restablecerPassword(){
    const nueva = document.getElementById('rec-nueva').value;
    const msg = document.getElementById('rec2-msg');
    const encontrado = usuarios.find(x => x.usuario === usuarioRecuperando);

    if(!encontrado){ msg.className='msg err'; msg.textContent='Ocurrió un error, volvé a intentar.'; return; }
    if(nueva.length < 4){ msg.className='msg err'; msg.textContent='La nueva contraseña necesita al menos 4 caracteres.'; return; }

    encontrado.contrasena = nueva;
    guardarUsuarios();

    msg.className='msg ok'; msg.textContent='Contraseña actualizada. Ya podés iniciar sesión.';
    setTimeout(()=>{
        usuarioRecuperando = null;
        mostrarTab('login');
    }, 1200);
}

function cambiarPantalla(id){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function renderMenu(){
    document.getElementById('who-user').textContent = usuarioActual;
    const ul = document.getElementById('menu-list');
    ul.innerHTML = '';
    MENU.forEach(op => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'menu-item' + (op.exit ? ' exit' : '');
    btn.innerHTML = `<span class="num">${op.id}</span> ${op.texto}`;
    btn.onclick = () => op.exit ? cerrarSesion() : abrirCalculo(op.id);
    li.appendChild(btn);
    ul.appendChild(li);
    });
}

function volverAlMenu(){
    cambiarPantalla('screen-menu');
}


function calcularSuperficie(ancho, largo){
  return ancho * largo;
}
function calcularVolumen(superficie, espesor){
  return superficie * espesor;
}


function calcularMuro(espesorCm, largo, alto){
    const superficie = calcularSuperficie(largo, alto);
    const factor = espesorCm === 30
    ? { cemento:15.2, arena:0.115, ladrillos:120 }
    : { cemento:10.9, arena:0.09,  ladrillos:90  };
    return {
    "Superficie": superficie.toFixed(2) + " m²",
    "Cemento": (superficie * factor.cemento).toFixed(2) + " kg",
    "Arena": (superficie * factor.arena).toFixed(3) + " m³",
    "Ladrillos": Math.ceil(superficie * factor.ladrillos) + " un."
    };
}

function calcularViga(largo){
    return {
    "Cemento": (largo * 9).toFixed(2) + " kg",
    "Arena": (largo * 0.02).toFixed(3) + " m³",
    "Piedra": (largo * 0.02).toFixed(3) + " m²",
    "Hierro del 8": (largo * 4).toFixed(2) + " m",
    "Hierro del 4": (largo * 3).toFixed(2) + " m"
    };
}

function calcularColumna(largo){
    return {
    "Cemento": (largo * 7.5).toFixed(2) + " kg",
    "Arena": (largo * 0.016).toFixed(3) + " m³",
    "Piedra": (largo * 0.016).toFixed(3) + " m²",
    "Hierro del 10": (largo * 6).toFixed(2) + " m",
    "Hierro del 4": (largo * 3).toFixed(2) + " m"
    };
}

function calcularContrapiso(espesor, ancho, largo){
    const superficie = calcularSuperficie(ancho, largo);
    const volumen = calcularVolumen(superficie, espesor);
    return {
    "Volumen": volumen.toFixed(3) + " m³",
    "Cemento": (volumen * 105).toFixed(2) + " kg",
    "Arena": (volumen * 0.45).toFixed(3) + " m³",
    "Piedra": (volumen * 0.9).toFixed(3) + " m³"
    };
}

function calcularTecho(espesor, ancho, largo){
    const superficie = calcularSuperficie(ancho, largo);
    return {
    "Superficie": superficie.toFixed(2) + " m²",
    "Cemento": (superficie * 33).toFixed(2) + " kg",
    "Arena": (superficie * 0.072).toFixed(3) + " m³",
    "Piedra": (superficie * 0.072).toFixed(3) + " m³",
    "Hierro del 8": (superficie * 7).toFixed(2) + " m",
    "Hierro del 6": (superficie * 4).toFixed(2) + " m"
    };
}

function calcularPisos(ancho, largo){
    const superficie = calcularSuperficie(ancho, largo);
  const conRecorte = superficie * 1.10;
    return {
    "Superficie base": superficie.toFixed(2) + " m²",
    "Con 10% de recorte": conRecorte.toFixed(2) + " m²"
    };
}

function calcularPintura(superficie){
    const litros = superficie / 6;
    return {
    "Pintura necesaria": litros.toFixed(2) + " L"
    };
}


const CONFIG = {
    1: { titulo:"Muro de ladrillo", n:"1/8" },
    2: { titulo:"Viga de hormigón", n:"2/8" },
    3: { titulo:"Columna de hormigón", n:"3/8" },
    4: { titulo:"Contrapiso", n:"4/8" },
    5: { titulo:"Techo", n:"5/8" },
    6: { titulo:"Pisos", n:"6/8" },
    7: { titulo:"Pintura", n:"7/8" }
};

function abrirCalculo(id){
    cambiarPantalla('screen-calc');
    document.getElementById('calc-head').textContent = 'Subprograma ' + CONFIG[id].n;
    document.getElementById('calc-title').textContent = CONFIG[id].titulo;
    document.getElementById('calc-result').innerHTML = '';
    const form = document.getElementById('calc-form');

if(id === 1){
    form.innerHTML = `
        <label>Espesor del muro</label>
        <div class="radio-row">
        <div class="radio-opt sel" data-val="20" onclick="elegirEspesor(this)">20 cm</div>
        <div class="radio-opt" data-val="30" onclick="elegirEspesor(this)">30 cm</div>
        </div>
        <label for="c-largo">Largo (m)</label><input id="c-largo" type="number" min="0" step="0.01">
        <label for="c-alto">Alto (m)</label><input id="c-alto" type="number" min="0" step="0.01">
        <button class="btn" onclick="ejecutar(1)">Calcular</button>`;
} else if(id === 2 || id === 3){
    form.innerHTML = `
        <label for="c-largo">Largo (m)</label><input id="c-largo" type="number" min="0" step="0.01">
        <button class="btn" onclick="ejecutar(${id})">Calcular</button>`;
} else if(id === 4 || id === 5){
    form.innerHTML = `
        <label for="c-espesor">Espesor (m)</label><input id="c-espesor" type="number" min="0" step="0.01">
        <label for="c-ancho">Ancho (m)</label><input id="c-ancho" type="number" min="0" step="0.01">
        <label for="c-largo">Largo (m)</label><input id="c-largo" type="number" min="0" step="0.01">
        <button class="btn" onclick="ejecutar(${id})">Calcular</button>`;
} else if(id === 6){
    form.innerHTML = `
        <label for="c-ancho">Ancho del paño (m)</label><input id="c-ancho" type="number" min="0" step="0.01">
        <label for="c-largo">Largo del paño (m)</label><input id="c-largo" type="number" min="0" step="0.01">
        <button class="btn" onclick="ejecutar(6)">Calcular</button>`;
    } else if(id === 7){
    form.innerHTML = `
        <label for="c-superficie">Superficie del muro (m²)</label><input id="c-superficie" type="number" min="0" step="0.01">
        <button class="btn" onclick="ejecutar(7)">Calcular</button>`;
    }
}

let espesorMuroSel = 20;
function elegirEspesor(el){
    document.querySelectorAll('.radio-opt').forEach(x => x.classList.remove('sel'));
    el.classList.add('sel');
    espesorMuroSel = Number(el.dataset.val);
}

function num(id){ return Number(document.getElementById(id).value) || 0; }

function ejecutar(id){
    let resultado;
    if(id === 1) resultado = calcularMuro(espesorMuroSel, num('c-largo'), num('c-alto'));
    else if(id === 2) resultado = calcularViga(num('c-largo'));
    else if(id === 3) resultado = calcularColumna(num('c-largo'));
    else if(id === 4) resultado = calcularContrapiso(num('c-espesor'), num('c-ancho'), num('c-largo'));
    else if(id === 5) resultado = calcularTecho(num('c-espesor'), num('c-ancho'), num('c-largo'));
    else if(id === 6) resultado = calcularPisos(num('c-ancho'), num('c-largo'));
    else if(id === 7) resultado = calcularPintura(num('c-superficie'));

    const rows = Object.entries(resultado).map(([k,v]) =>
    `<div class="ticket-row"><span>${k}</span><span class="v">${v}</span></div>`).join('');
    document.getElementById('calc-result').innerHTML = `
    <div class="ticket">
            <p class="ticket-title">Materiales necesarios</p>
            ${rows}
    </div>`;
}