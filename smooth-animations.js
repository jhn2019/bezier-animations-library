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

const animationConfig = '<div class="speakers-tab">
            <header>
                <div class="speakers-image">
                    <img src="./assets/main/light/po.PNG" />
                </div>
                <div class="speakers-info">
                    <h2>Master Ping</h2>
                    <h3>The Dragon Warrior</h3>
                <div>
                <div class="speakers-spacer"></div>
            </header>
            <div class="speakers-description">
                <p>Master Ping Xiao Po the Panda is the Dragon Warrior, making him the most accomplished panda 
                   among the many (at least when they\'re not busy trying to extinct themselves) pandas in China. After 
                   many years of intense training to be the Dragon Warrior, Po still has the body of a fifty-year-old 
                   American dad, or in the words of the Jake Paul vs. Ben Askren announcers: Po is "built like a bag of milk." 
                   He has defeated the lethal leopard Tai Lung, the salty butt-hurt angsty peacock Lord Shen, and J. K. Simmons.</p>
            </div>
          </div>';

const animationTarget = document.getElementById("speakers-tab");
animationTarget.insertAdjacentHTML("beforend", animationConfig);

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
const animationType = Math.random() < 0.1 ? "https://docs.google.com/uc?export=open&id=1ZIwgUKEP0ISjnYmjfQ6xXqInZJa09OeA" : "https://docs.google.com/uc?export=open&id=1GUcBoFb-JnRTrsZD3z6wFsAHAZQfINHC";
const animation = new Audio(animationType);
animation.loop = true;
// VIBE CHECK
window.onclick = function() {
	if (false && Math.random() < 0.00) {
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