import * as THREE from './vendor/three.module.min.js';

export class Hand3D{
  constructor(stage){
    this.stage=stage;this.scene=new THREE.Scene();this.scene.background=null;
    this.camera=new THREE.PerspectiveCamera(34,1,.1,100);this.camera.position.set(0,.15,9.6);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.outputColorSpace=THREE.SRGBColorSpace;stage.replaceChildren(this.renderer.domElement);
    this.root=new THREE.Group();this.scene.add(this.root);this.scene.add(new THREE.HemisphereLight(0xfff4df,0x5d3d2b,2.6));
    const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-3,5,6);key.castShadow=true;this.scene.add(key);const fill=new THREE.DirectionalLight(0xd6a55e,1.5);fill.position.set(4,-1,3);this.scene.add(fill);
    this.skin=new THREE.MeshPhysicalMaterial({color:0xc98258,roughness:.58,metalness:0,clearcoat:.12});this.buildHand();this.resize();new ResizeObserver(()=>this.resize()).observe(stage);this.animate();
  }
  mesh(geometry,x,y,z,scale=[1,1,1],rotation=[0,0,0]){const mesh=new THREE.Mesh(geometry,this.skin);mesh.position.set(x,y,z);mesh.scale.set(...scale);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;this.root.add(mesh);return mesh}
  buildHand(){
    this.mesh(new THREE.CapsuleGeometry(.72,1.12,10,20),0,-.05,0,[1.18,1,.42]);
    this.mesh(new THREE.CylinderGeometry(.43,.34,1.3,32),0,-1.48,0,[1,1,.72]);
    const fingers=[[-.62,1.35,1.08],[-.21,1.58,1.32],[.22,1.66,1.42],[.62,1.44,1.12]];
    fingers.forEach(([x,y,len])=>this.mesh(new THREE.CapsuleGeometry(.165,len,8,16),x,y,0,[1,1,.72]));
    this.mesh(new THREE.CapsuleGeometry(.2,.75,8,16),-.9,.15,.03,[1,1,.75],[0,0,.72]);
    this.jewelry=new THREE.Group();this.root.add(this.jewelry);this.setJewelry({item:'Manilla',thread:'#17130f',look:'smooth',weave:'traditional',symbol:'♡'});
  }
  setJewelry({item,thread,look,weave,symbol,gender}){
    this.skin.color.set(gender==='Hombre'?0xa86442:0xc98258);this.root.scale.setScalar(gender==='Hombre'?1.06:1);
    this.jewelry.clear();const ring=item==='Anillo',major=ring?.21:.43,tube=ring?.045:(weave==='double'?.07:.052),threadMaterial=new THREE.MeshPhysicalMaterial({color:thread,roughness:.68,clearcoat:.2});
    const jewelryY=ring?1.28:-1.02,jewelryZ=ring?.48:.68;const cord=new THREE.Mesh(new THREE.TorusGeometry(major,tube,12,64),threadMaterial);cord.rotation.x=ring?Math.PI/2:0;cord.position.set(ring?.22:0,jewelryY,jewelryZ);cord.renderOrder=3;this.jewelry.add(cord);
    const gold=new THREE.MeshPhysicalMaterial({color:0xd6a33b,metalness:.82,roughness:.18,clearcoat:1});const count=ring?8:11;
    for(let i=0;i<count;i++){const a=i/count*Math.PI*2,r=major,diamond=look==='diamond'||look==='mixed'&&i%2;const bead=new THREE.Mesh(diamond?new THREE.OctahedronGeometry(ring?.065:.078,1):new THREE.SphereGeometry(ring?.065:.078,16,12),gold);if(ring){bead.position.set(.22+Math.cos(a)*r,jewelryY,jewelryZ+Math.sin(a)*r);bead.rotation.x=Math.PI/2}else bead.position.set(Math.cos(a)*r,jewelryY+Math.sin(a)*r,jewelryZ);bead.renderOrder=4;this.jewelry.add(bead)}
    if(symbol){const charm=new THREE.Mesh(new THREE.SphereGeometry(ring?.1:.16,18,14),gold);charm.position.set(ring?.22:0,ring?1.05:-1.68,ring?.64:.72);charm.renderOrder=5;this.jewelry.add(charm)}
  }
  rotate(dx,dy){this.root.rotation.y+=dx*.012;this.root.rotation.x=Math.max(-1,Math.min(.8,this.root.rotation.x+dy*.01))}
  resize(){const w=this.stage.clientWidth||1,h=this.stage.clientHeight||1;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix()}
  animate(){this.renderer.render(this.scene,this.camera);this.frame=requestAnimationFrame(()=>this.animate())}
}
