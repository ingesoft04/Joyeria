import * as THREE from './vendor/three.module.min.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';

export class Hand3D{
  constructor(stage){
    this.stage=stage;this.scene=new THREE.Scene();this.scene.background=null;
    this.camera=new THREE.PerspectiveCamera(34,1,.1,100);this.camera.position.set(0,.05,8.4);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.outputColorSpace=THREE.SRGBColorSpace;stage.replaceChildren(this.renderer.domElement);
    this.root=new THREE.Group();this.scene.add(this.root);this.scene.add(new THREE.HemisphereLight(0xfff4df,0x5d3d2b,2.6));
    const key=new THREE.DirectionalLight(0xfff8ee,3.2);key.position.set(-3,5,6);key.castShadow=true;this.scene.add(key);const fill=new THREE.DirectionalLight(0xe2ad76,1.2);fill.position.set(4,-1,3);this.scene.add(fill);
    this.skin=new THREE.MeshPhysicalMaterial({color:0xc98258,roughness:.68,metalness:0,clearcoat:.08,sheen:.22,sheenColor:new THREE.Color(0xffd2bd)});this.nail=new THREE.MeshPhysicalMaterial({color:0xeab29f,roughness:.38,clearcoat:.28});this.buildHand();this.loadHumanHand();this.resize();new ResizeObserver(()=>this.resize()).observe(stage);this.animate();
  }
  mesh(geometry,x,y,z,scale=[1,1,1],rotation=[0,0,0],material=this.skin,parent=this.root){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.scale.set(...scale);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
  finger(x,base,lengths,lean=0){const group=new THREE.Group();group.position.set(x,base,0);group.rotation.z=lean;this.root.add(group);let y=0;lengths.forEach((length,index)=>{const radius=.15-index*.012;this.mesh(new THREE.CapsuleGeometry(radius,length,8,16),0,y+length/2,0,[1,1,.76],[index*.018,0,0],this.skin,group);if(index<2)this.mesh(new THREE.SphereGeometry(radius*1.03,16,10),0,y+length+.02,.005,[1,.82,.76],[0,0,0],this.skin,group);y+=length*.9});this.mesh(new THREE.SphereGeometry(.105,16,12),0,y-.07,.125,[1,.72,.28],[-.12,0,0],this.nail,group)}
  buildHand(){
    this.fallback=new THREE.Group();this.root.add(this.fallback);
    const priorRoot=this.root;this.root=this.fallback;
    this.mesh(new THREE.SphereGeometry(.82,36,24),0,-.04,0,[1.08,1.22,.48]);
    this.mesh(new THREE.CylinderGeometry(.43,.34,1.3,32),0,-1.48,-.015,[1,1,.78]);
    this.finger(-.57,.58,[.43,.34,.28],-.025);this.finger(-.19,.66,[.48,.39,.31],-.008);this.finger(.2,.64,[.45,.37,.29],.012);this.finger(.56,.54,[.37,.3,.24],.045);
    const thumb=new THREE.Group();thumb.position.set(-.69,-.06,.01);thumb.rotation.z=.7;this.root.add(thumb);this.mesh(new THREE.CapsuleGeometry(.19,.42,8,16),0,.2,0,[1,1,.78],[0,0,0],this.skin,thumb);this.mesh(new THREE.CapsuleGeometry(.16,.32,8,16),0,.57,.015,[1,1,.76],[0,0,.12],this.skin,thumb);this.mesh(new THREE.SphereGeometry(.11,16,12),-.02,.78,.135,[1,.72,.28],[0,0,.12],this.nail,thumb);
    [-.57,-.19,.2,.56].forEach(x=>this.mesh(new THREE.SphereGeometry(.075,16,12),x,.5,.31,[1.25,.62,.18]));
    this.root=priorRoot;this.jewelry=new THREE.Group();this.root.add(this.jewelry);this.setJewelry({item:'Manilla',thread:'#17130f',look:'smooth',weave:'traditional',symbol:'♡'});
  }
  loadHumanHand(){
    new GLTFLoader().load('./assets/3d/human-hand.glb',gltf=>{
      this.human=gltf.scene;this.human.rotation.set(0,0,-Math.PI/2);this.human.scale.setScalar(.82);this.human.position.set(-.08,-.15,0);
      this.human.traverse(node=>{if(!node.isMesh)return;node.castShadow=true;node.receiveShadow=true;if(node.material){node.material.roughness=.68;node.material.metalness=0}});
      this.root.add(this.human);this.fallback.visible=false;if(this.currentJewelry)this.setJewelry(this.currentJewelry);
    },undefined,()=>{this.fallback.visible=true});
  }
  setJewelry({item,thread,look,weave,symbol,gender}){
    this.currentJewelry={item,thread,look,weave,symbol,gender};
    this.stage.dataset.jewelry=item;this.stage.dataset.hand=gender||'';
    this.skin.color.set(gender==='Hombre'?0xa86442:0xc98258);this.nail.color.set(gender==='Hombre'?0xc88470:0xeab29f);this.root.scale.set(gender==='Hombre'?1.08:.98,gender==='Hombre'?1.03:1,gender==='Hombre'?1.07:.96);
    if(this.human)this.human.traverse(node=>{if(node.isMesh&&node.material?.color)node.material.color.set(gender==='Hombre'?0xb87655:0xd59a78)});
    this.jewelry.clear();const ring=item==='Anillo',major=ring?.21:.43,tube=ring?.045:(weave==='double'?.07:.052),threadMaterial=new THREE.MeshPhysicalMaterial({color:thread,roughness:.68,clearcoat:.2});
    const jewelryX=ring?.22:1.18,jewelryY=ring?1.28:-.8,jewelryZ=ring?.48:.02;const cord=new THREE.Mesh(new THREE.TorusGeometry(major,tube,12,64),threadMaterial);cord.rotation.x=Math.PI/2;cord.position.set(jewelryX,jewelryY,jewelryZ);cord.renderOrder=3;this.jewelry.add(cord);
    const gold=new THREE.MeshPhysicalMaterial({color:0xd6a33b,metalness:.82,roughness:.18,clearcoat:1});const count=ring?8:11;
    for(let i=0;i<count;i++){const a=i/count*Math.PI*2,r=major,diamond=look==='diamond'||look==='mixed'&&i%2;const bead=new THREE.Mesh(diamond?new THREE.OctahedronGeometry(ring?.065:.078,1):new THREE.SphereGeometry(ring?.065:.078,16,12),gold);bead.position.set(jewelryX+Math.cos(a)*r,jewelryY,jewelryZ+Math.sin(a)*r);bead.rotation.x=Math.PI/2;bead.renderOrder=4;this.jewelry.add(bead)}
    if(symbol){const charm=new THREE.Mesh(new THREE.SphereGeometry(ring?.1:.14,18,14),gold);charm.position.set(jewelryX,ring?1.05:-1.03,ring?.64:.48);charm.renderOrder=5;this.jewelry.add(charm)}
  }
  rotate(dx,dy){this.root.rotation.y+=dx*.012;this.root.rotation.x=Math.max(-1,Math.min(.8,this.root.rotation.x+dy*.01))}
  resize(){const w=this.stage.clientWidth||1,h=this.stage.clientHeight||1;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix()}
  animate(){this.renderer.render(this.scene,this.camera);this.frame=requestAnimationFrame(()=>this.animate())}
}
