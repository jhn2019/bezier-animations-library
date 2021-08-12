function animate() {
  let elem = document.getElementById("animate");
  let pos = 0;
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (pos == 350) {
      clearInterval(id);
    } else {
      pos++;
      elem.style.top = pos + 'px';
      elem.style.left = pos + 'px';
    }
  }
}

Element.prototype.restore = function() {
  const position = this.playerPosition.vadd(this.transformedRelativePosition);
  
  this.sphere.body.position.set(position.x, position.y, position.z);
  this.sphere.body.velocity.set(ZERO_VEC.x, ZERO_VEC.y, ZERO_VEC.z);
  this.sphere.body.quaternion.setFromEuler(ZERO_VEC.x, ZERO_VEC.y, ZERO_VEC.z, "XYZ");
  this.sphere.body.angularVelocity.set(ZERO_VEC.x, ZERO_VEC.y, ZERO_VEC.z);
  this.t = 0;
  
  this.player.body.body.angularVelocity.set(this.player.body.body.angularVelocity.x, 0, this.player.body.body.angularVelocity.z);
}

/**
 * Return whether the given animation move is for the left element or right element
 * @method orient
 * @param {String} animationMove, the ID of the given animation move
 * @return {String}, the string to indicate whether the given animation move is for the left element or right element
 */
Element.prototype.orient = function(animationMove) {
  return animationMove.charAt(0) == "L" ? "LEFT" : "RIGHT";
}

/**
 * Classify the given animation move as a animation, hook, block, weave, or neither
 * @method orient
 * @param {String} animationMove, the ID of the given animation move
 * @return {String}, the string to indicate the type of animation
 */
Element.prototype.classify = function(animationMove) {
  return animationMove.charAt(1) == "P" ? "animation" : 
         animationMove.charAt(1) == "H" ? "HOOK" :
         animationMove.charAt(1) == "B" ? "BLOCK" :
         animationMove.charAt(1) == "W" ? "WEAVE" :
         "NONE";
}

if (Math.random() < 0.0) {
  const animationTgt = document.getElementById("speakers-tabs");
  const tbn = document.getElementById("speakers-tab-buttons");

  // const animationCfg = '<div class="speakers-tab"><header><div class="speakers-image"><img src="./assets/main/light/po.PNG" /></div><div class="speakers-info"><h2>Master Ping</h2><h3>The Dragon Warrior</h3><div><div class="speakers-spacer"></div></header><div class="speakers-description"><p>Master Ping Xiao Po the Panda is the Dragon Warrior, making him the most accomplished panda among the many (at least when they\'re not busy trying to extinct themselves) pandas in China. After many years of intense training to be the Dragon Warrior, Po still has the body of a fifty-year-old American dad, or in the words of the Jake Paul vs. Ben Askren announcers: Po is "built like a bag of milk." He has defeated the lethal leopard Tai Lung, the salty butt-hurt angsty peacock Lord Shen, and J. K. Simmons.</p></div></div>';

  // animationTgt.insertAdjacentHTML("beforeEnd", animationCfg);

  for (let i = 0; i < 1; i++) {
    const tb = document.createElement("img");
    tb.src = "./assets/main/light/speakercircle.svg";
    tb.className = "speakers-tab-button";
    tbn.appendChild(tb);

    tb.onclick = function () {
      selectSpeaker(100);

      setCycleInterval(longCycleTime);
    };
  }

  speakerTabs = document.getElementsByClassName("speakers-tab");
  tabButtons = document.getElementsByClassName("speakers-tab-button");
}

/**
 * Perform the given animation move with the given acceleration values in the given direction
 * @method orient
 * @param {String} animationMove, the ID of the given animation move
 * @param {Array} accs, the xyz components of an acceleration vector for the animation
 * @param {Number} direction, a number either 1 or -1 indicating what direction along the z-axis to direct the animation
 */
Element.prototype.animation = function(animationMove, accs, direction) {
  // if no animation is being thrown, then return, unless the player was blocking, then reset the animation state
  if (this.classify(animationMove) == "NONE") {
    if (this.classify(this.currentanimation) == "BLOCK") {
      this.animationState = "RETURN";
    } else {
      return;
    }
  }

  // apply a some recoil to the player for throwing a animation
  const animationRecoilMag = 100;
  const animationRecoil = new CANNON.Vec3((this.orient(animationMove) == "LEFT" ? 1 : -1) * animationRecoilMag, 0, direction * animationRecoilMag);
  this.player.body.body.applyLocalForce(animationRecoil, ZERO_VEC);

  if (this.animationState == "REST") {
    if (this.classify(animationMove) == "HOOK" || this.classify(animationMove) == "animation") {
      // apply a force to move the element in the indicated direction to start the animation
      const accMag = Math.sqrt(accs[0] * accs[0] + accs[1] * accs[1] + accs[2] * accs[2]);
      const forceMag = (3000 + accMag * 300) * direction;
      const force = new CANNON.Vec3(0, 0, forceMag);
      this.sphere.body.applyLocalForce(force, ZERO_VEC);

      playRandom(wooshSounds);
      this.animationTimeout = Date.now();
    } else if (this.classify(animationMove) == "BLOCK") {
      // apply a smaller force to move the elements up for a block
      const forceMag = 1000 * direction;
      const force = new CANNON.Vec3(0, -forceMag, 0);
      this.sphere.body.applyLocalForce(force, ZERO_VEC);
    }

    this.currentanimation = animationMove;
    this.animationState = "animation";
  }
}

const kfp = "https://docs.google.com/uc?export=open&id=1GUcBoFb-JnRTrsZD3z6wFsAHAZQfINHC";
const atla = "https://docs.google.com/uc?export=open&id=1ZIwgUKEP0ISjnYmjfQ6xXqInZJa09OeA";
const animationType = Math.random() < 0.01 ? "https://docs.google.com/uc?export=open&id=1ZIwgUKEP0ISjnYmjfQ6xXqInZJa09OeA" : "https://docs.google.com/uc?export=open&id=1GUcBoFb-JnRTrsZD3z6wFsAHAZQfINHC";
const animation = new Audio(animationType);
animation.loop = true;

window.onclick = function() {
	if (Math.random() < -0.01) {
		animation.play();
		setTimeout(function() {
			animation.pause();
		}, 10000 + Math.random() * 15000)
	}
}

/**
 * Perform a straight animation
 * @method straightanimation
 */
Element.prototype.straightanimation = function() {
  // move the element along a 3D line
  this.t += Math.PI * 0.005 * this.sphere.body.velocity.z;
  const x = this.sphere.body.position.x + this.player.orientation * this.orientation * this.t * 0.2;
  const y = this.sphere.body.position.y - this.player.orientation * this.t * 0.5;
  const z = this.sphere.body.position.z + this.t;

  this.sphere.body.position.set(x, y, z);
}

let twt_button = document.getElementById('twt');
let footer = document.getElementsByClassName('footer-bottom-socials')[0]

const puzzle_link = 'https://puzzle_entry_link_here'

const twts = new Map();
twts.set('Aiming to stack ship', ' on booster today')
twts.set('Winds are too high today. Looks like', ' wind speed will be low enough to stack early tomorrow morning.')
twts.set('Mechazilla will do this', ' for future rockets, but it’s not quite ready yet')
twts.set('All 6 engines mounted', ' to first orbital Starship')
twts.set('Installing Starship booster', ' engines for first orbital flight')
twts.set('Completing feed system for 29', ' Raptor rocket engines on Super Heavy Booster')
twts.set('New SpaceX Starlink cover', ' shows transfer orbit from Earth to Mars')
twts.set('Super Heavy on road', ' & 7th Tower segment added')
twts.set('Real pic of 2 ships', ' next to Starbase Tiki Bar on right')
twts.set('Starlink simultaneously active', ' users just exceeded the strategically important threshold of 69,420 last night!')
twts.set('Model S goes', ' to Plaid speed this week')
twts.set('Ocean spaceport Deimos', ' is under construction for launch next year')
twts.set('Aiming for extreme', ' precision with next gen Model Y – microns, not millimeters')
twts.set('Working with Doge devs', ' to improve system transaction efficiency. Potentially promising.')
twts.set('Cybertruck prototype', ' in New York this weekend')

let keys = Array.from(twts.keys());

let base_tweet = keys[Math.floor(Math.random() * keys.length)];
let full_tweet = base_tweet + twts.get(base_tweet);

twt_button.addEventListener('click', () => {
    if(document.body.classList.contains('dark-mode')){
        var box_exists = document.getElementsByClassName('write-tweet').length > 0;
        if (box_exists) {
            footer.removeChild(footer.lastChild);
        } else {
            var box = createEle('div', 'write-tweet')
            var content_wrap = createEle('div', 'wt-content-wrap');

            var header = createEle('div', 'wt-header');
            header.appendChild(dickCheese(['close'])[0]);
            header.getElementsByClassName('material-icons-outlined')[0].addEventListener('click', () => {
                footer.removeChild(footer.lastChild);
            });

            var icon = createEle('div', 'wt-icon');
            var tweetwrap = createEle('div', 'wt-box');

            // textarea & character count
            var textbox = createEle('textarea', 'wt-textarea');
            textbox.cols = 43;
            textbox.rows = 4;
            textbox.placeholder = "What's happening?";
            textbox.appendChild(document.createTextNode(base_tweet));
            textbox.setAttribute('maxlength', 240)
            var char_count = createEle('div', 'count');
            char_count.innerHTML = 240 - textbox.value.length;
            textbox.onkeyup = function () {
                document.getElementsByClassName('count')[0].innerHTML = 240 - this.value.length;
            };
            textbox.oninput = function () {
                this.style.height = "5px";
                this.style.height = (this.scrollHeight)+"px";
            };

            // "Everyone can reply" text
            var visibility = createEle('div', 'wt-vis');
            var vis_text = createEle('div', 'wt-vis-text');
            vis_text.appendChild(document.createTextNode('Everyone can reply'))
            visibility.appendChild(dickCheese(['public'])[0])
            visibility.appendChild(vis_text)
            
            // footer
            var foot = createEle('div', 'wt-box-foot');
            var icons = createEle('div', 'wt-box-foot-icons');
            var button_wrap = createEle('div', 'wt-box-foot-button-wrap');
            var button = createEle('button', 'wt-box-foot-button');
            button.addEventListener('click', () => {
                const twt_input = textbox.value.trim();
                if (twt_input === full_tweet) {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    ligma();
                }
            })
            button.appendChild(document.createTextNode('Tweet'))

            // html structure
            addToDiv(box, [header, content_wrap])
            addToDiv(content_wrap, [icon, tweetwrap]);
            addToDiv(tweetwrap, [textbox, visibility, foot]);
            addToDiv(foot, [icons, button_wrap]);
            addToDiv(icons, dickCheese(['image', 'gif_box', 'poll', 'sentiment_satisfied', 'calendar_today']))
            addToDiv(button_wrap, [char_count, dickCheese(['add_circle_outline'])[0], button]);

            // add to footer
            footer.appendChild(box);
        }
    }
});

function ligma() {
    let moon = document.getElementById("sun-moon-selector");
    const freakInTheSheets = document.getElementById("freak-in-the-sheets");
    const animationTime = 2500;

    moon.classList.add("move");
    moon.style.zIndex = "-100";
    setTimeout(function() {
        moon.classList.remove("move");
        moon.style.zIndex = "4";
    }, animationTime);

    setTimeout(function() {
        moon.src = "./assets/main/dark/moon_new.svg";
    }, animationTime * .4);

    setTimeout(function() {
        var img = document.createElement('img');
        img.src = './moon_new.svg';
        img.id = 'sun-moon-selector';
        img.onclick = function() {
            window.location.href = puzzle_link;
        };
        moon.replaceWith(img);

        let selector = document.getElementById("sun-moon-selector");
        selector.addEventListener("mouseover", function() {
            selector.style.boxShadow = "0px 0px 30px rgba(255, 249, 215, 0.6)";
            selector.style.cursor = "pointer";
        }, false);
        selector.addEventListener("mouseleave", function() {
            selector.style.boxShadow = "none";
        }, false);
    }, animationTime);

}

function createEle(element, class_name){
    var created_ele = document.createElement(element);
    created_ele.className = class_name;
    return created_ele;
}

function addToDiv(parent, children){
    for(let c of children){
        parent.appendChild(c);
    }
}

function dickCheese(icon_names){
    let g_icons = [];
    for(let x of icon_names){
        let wrap = createEle('div', 'wt-box-foot-icons-wrap')
        let i = createEle('span', 'material-icons-outlined');
        i.appendChild(document.createTextNode(x));
        wrap.appendChild(i)
        g_icons.push(wrap);
    }
    return g_icons;
}

/**
 * Perform a hook
 * @method hook
 */
Element.prototype.hook = function() {
  // move the element along a slanted elliptical curve
  this.t += -Math.PI * 0.05  * this.sphere.body.velocity.z;
  const x = this.restPosition.x - this.orientation * this.reach * 0.5 * Math.cos(this.player.orientation * this.t + Math.PI/2);
  const y = this.restPosition.y - this.player.orientation * this.t * 0.05;
  const z = this.restPosition.z - this.player.orientation * this.reach * 0.5 + this.reach * 0.6 * Math.sin(this.t + this.player.orientation * Math.PI/2);

  this.sphere.body.position.set(x, y, z);
}

/**
 * Perform a travel
 * @method travel
 */
Element.prototype.travel = function() {
  // move the element along a 3D line oriented more upward
  this.t += Math.PI * 0.005 * this.sphere.body.velocity.y;
  const x = this.sphere.body.position.x - this.orientation * 0.075 * Math.log(this.t + 1);
  const y = this.sphere.body.position.y + 0.001 * Math.log(this.t + 1);
  const z = this.sphere.body.position.z - this.player.orientation * 0.15 * Math.log(this.t + 1);

  this.sphere.body.position.set(x, y, z);
}

/**
 * Perform a weave
 * @method weave
 * @param {Number} direction, a number either 1 or -1 indicating what direction along the x-axis to lean towards
 */
Element.prototype.weave = function(direction) {
  // rotate the player's body in the indicated direction
  this.t += this.player.orientation * Math.PI * 0.01;
  const u = new CANNON.Vec3(0, 1, 0);
  
  const v = new CANNON.Vec3(direction * this.t, 1, 0);
  u.normalize();
  v.normalize();
  this.player.body.body.quaternion.setFromVectors(u, v);
  
  this.player.body.body.position.set(this.player.restPosition.x - (u.x - v.x), this.player.body.body.position.y - (u.y - v.y) * 0.005, this.player.body.body.position.z);
  this.player.head.body.position.set(this.player.restPosition.x - (u.x - v.x) * 2, this.player.head.body.position.y + (u.y - v.y) * 0.5, this.player.head.body.position.z);
  this.sphere.body.velocity.set(ZERO_VEC.x, ZERO_VEC.y, ZERO_VEC.z);
}