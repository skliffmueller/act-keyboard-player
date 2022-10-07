import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import KeyswitchObj from './models/keyswitch';
import KeyfaceObj from './models/keyface';
import {GLCharSprites} from "./charsprites";

import KeyswitchImageUrl from '../../assets/keyswitch.png';
import CharImageUrl from '../../assets/char.png';
import { VirtualKeyCodes } from "../../typings/virtualKeys.d";
import {mat4} from "gl-matrix";

import { keyList } from "./constants";
import { KeySwitch } from "./keyswitch";
import { KeyBackFace } from "./keybackface";

export class Keyboard {
    constructor({canvas, keySize}) {
        this.keyCodes = [];
        this.keySize = keySize || 8;
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({canvas, antialias: true});


        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 30, this.canvas.clientWidth / this.canvas.clientHeight, 0.01, 80 );
        this.camera.position.z = 64;
        this.scene.background = new THREE.Color( 0x050505 );

        this.initializeAssets();

    }

    initializeAssets = () => {
        GLCharSprites.onImageLoad(KeyswitchImageUrl, CharImageUrl, ({baseImage, charImage}) => {
            this.sprite = new GLCharSprites(baseImage, charImage);
            this.sprite.setCharMapCords(7, 10, 26, 26, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()[]/{}|;':\",.\\<>?-=_+");

            this.createKeys({baseImage, charImage});

            const rad = 12 * (Math.PI / 180);
            const z = Math.cos(rad);
            const y = Math.sin(rad);
            const rightLight = new THREE.DirectionalLight( 0xdfeaff, 0.17 );
            rightLight.position.set(-0.5, y, z);

            this.scene.add(rightLight);

            const centerLight = new THREE.DirectionalLight( 0xdfeaff, 0.18 );
            centerLight.position.set(0, y, z);

            this.scene.add(centerLight);

            const leftLight = new THREE.DirectionalLight( 0xdfeaff, 0.17 );
            leftLight.position.set(0.5, y, z);

            this.scene.add(leftLight);

            const rightCenterLight = new THREE.DirectionalLight( 0xdfeaff, 0.14 );
            rightLight.position.set(-0.7, y + 2, z);

            this.scene.add(rightLight);

            const leftCenterLight = new THREE.DirectionalLight( 0xdfeaff, 0.14 );
            leftLight.position.set(0.7, y + 2, z);

            this.scene.add(leftLight);

            this.addPrettyLights();
            this.frameDropCount = 0;
            this.then = -1;
            requestAnimationFrame(this.animate);
        });
    }


    createKeys = ({baseImage, charImage}) => {
        const keySwitchPadding = 0.2;
        const keySwitchSize = 3;
        const keySwitchSizeWithPadding = keySwitchSize + keySwitchPadding;
        const keyRowWidth = (keySwitchSizeWithPadding * 15) - keySwitchPadding;
        const keyRowHalfWidth = keyRowWidth / 2;
        const keyboardHeight = (keySwitchSizeWithPadding * 6) - keySwitchPadding;

        let zOffset = 20;
        let yOffset = 0;
        this.rad = (-22.5 * ( Math.PI / 180));
        this.keyDirection = new THREE.Vector3(0, Math.sin(-this.rad), Math.cos(-this.rad));
        this.group = new THREE.Group();
        this.lights = [];
        this.keySwitches = [];
        this.keyFaces = [];
        this.keyLights = [];
        keyList.forEach((row, rowIndex) => {
            let xOffset = -keyRowHalfWidth;
            row.forEach((col, colIndex) => {
                const size = col.size ? col.size : 1;
                const currentKeySizeWithPadding = keySwitchSizeWithPadding * size;
                const currentKeySize = currentKeySizeWithPadding - keySwitchPadding;
                const baseImageWidth = Math.floor(((baseImage.width / 3) * 2) + ((baseImage.width/3) * size));
                const baseImageWidthEven = (baseImageWidth % 2) !== 0 ? baseImageWidth + 1 : baseImageWidth;
                const switchSpriteData = this.sprite.createBaseWithString(baseImageWidthEven / 2, (baseImage.height / 16) * 9, col.label, baseImageWidthEven, baseImage.height);

                let keyface = KeyBackFace.createMesh(KeyBackFace.createBuffer(currentKeySizeWithPadding, keySwitchSizeWithPadding, keySwitchSizeWithPadding), switchSpriteData);
                keyface.userData = {
                    ...col,
                    rowIndex,
                    colIndex,
                };
                keyface.position.set( xOffset + (currentKeySizeWithPadding / 2), yOffset + (keySwitchPadding / 2), zOffset - (keySwitchSize / 2) - 0.3 );
                keyface.rotation.set(((90) * (Math.PI / 180)), 0, 0);
                this.group.add(keyface);
                this.keyFaces.push(keyface);

                if(!col.value) {
                    xOffset += currentKeySizeWithPadding;
                    return;
                }

                let keyswitchMesh = KeySwitch.createMesh(KeySwitch.createBuffer(currentKeySize, keySwitchSize, keySwitchSize), switchSpriteData);
                keyswitchMesh.userData = {
                    ...col,
                    rowIndex,
                    colIndex,
                    isPressed: false,
                    keyLightIndex: -1,
                };
                keyswitchMesh.position.set( xOffset + (currentKeySize / 2), yOffset, zOffset );
                keyswitchMesh.rotation.set(((90) * (Math.PI / 180)), 0, 0);
                this.group.add(keyswitchMesh);
                this.keySwitches.push(keyswitchMesh);

                xOffset += currentKeySizeWithPadding;
            });
            yOffset -= keySwitchSizeWithPadding;
        });

        for(let i = 0;i < 6;i++) {
            const light = new THREE.PointLight( 0x8b5cf6, 0.0, 6 );
            light.position.set( 0, 0, zOffset  );
            this.group.add(light);
            this.keyLights.push(light);
        }


        this.group.rotation.set(this.rad, 0, 0);

        this.scene.add(this.group);
    }

    setKeyCodes = (keyCodes) => {
        this.keyCodes = keyCodes;
    }

    addPrettyLights = () => {
        const keySwitchPadding = 0.2;
        const keySwitchSize = 3;
        const keySwitchSizeWithPadding = keySwitchSize + keySwitchPadding;
        const keyRowWidth = (keySwitchSizeWithPadding * 15) - keySwitchPadding;
        const keyRowHalfWidth = keyRowWidth / 2;
        const keyboardHeight = (keySwitchSizeWithPadding * 6) - keySwitchPadding;

        let zOffset = 20;
        let yOffset = 0;
        this.lightGroup = new THREE.Group();
        this.lights = [];
        keyList.forEach((row, rowIndex) => {
            let xOffset = -keyRowHalfWidth;
            row.forEach((col, colIndex) => {
                const size = col.size ? col.size : 1;
                const currentKeySizeWithPadding = keySwitchSizeWithPadding * size;
                const currentKeySize = currentKeySizeWithPadding - keySwitchPadding;

                if(!col.value) {
                    xOffset += currentKeySizeWithPadding;
                    return;
                }

                const light = new THREE.PointLight( 0xffffff, 0.8, 8, 1 );
                light.position.set( xOffset + (currentKeySize / 2), yOffset, zOffset - (currentKeySize / 2) );
                light.userData = {
                    ...col,
                    rowIndex,
                    colIndex,
                };
                this.lightGroup.add(light);
                this.lights.push(light);

                xOffset += currentKeySizeWithPadding;
            });
            yOffset -= keySwitchSizeWithPadding;
        });
        this.lightGroup.rotation.set(this.rad, 0, 0);

        this.scene.add(this.lightGroup);
    }

    removePrettyLights = () => {
        this.lightGroup.clear();
        this.lights.forEach((light) => {
            light.dispose();
        });
        this.lights = [];
    }

    animate = (now) => {
        requestAnimationFrame( this.animate );

        now *= 0.001;                          // convert to seconds
        if(this.then !== -1) {
            const deltaTime = now - this.then;          // compute time since last frame
            const fps = 1 / deltaTime;             // compute frames per second
            if(fps < 24) {
                this.frameDropCount++;
                if(this.frameDropCount > 3) {
                    if(this.lights.length) {
                        this.removePrettyLights();
                    }
                }
            } else {
                if(this.frameDropCount > 0) {
                    this.frameDropCount--;
                }
            }
        }
        this.then = now;                            // remember time for next frame
        const time = performance.now();

        const counter = Math.floor(time * 0.02);

        this.lights.forEach((light) => {
            const {rowIndex, colIndex} = light.userData;

            const index = (rowIndex+colIndex);
            const r = (counter+index) % 4;
            const g = (counter+index-r) % 8;
            const b = (counter+index-(r+g)) % 16;
            light.color.set(new THREE.Color(r * 0.14,g * 0.14,b * 0.14));

        });

        this.keyLights.forEach((light) => {
            light.intensity = 0.0;
        });
        let keyLightIndex = 0;
        this.keySwitches.forEach((keySwitch) => {
             const shouldPress = this.keyCodes.indexOf(keySwitch.userData.value) !== -1;

             if(shouldPress) {
                 if(keyLightIndex < this.keyLights.length) {
                     this.keyLights[keyLightIndex].intensity = 0.4;
                     this.keyLights[keyLightIndex].position.set(keySwitch.position.x, keySwitch.position.y, keySwitch.position.z);
                     this.keyLights[keyLightIndex].position.addScaledVector(this.keyDirection, 4);
                     keyLightIndex++;
                 }
             }
             if(keySwitch.userData.isPressed !== shouldPress) {
                 if(shouldPress) {
                     keySwitch.position.addScaledVector(this.keyDirection, -0.3);

                 } else {
                     keySwitch.position.addScaledVector(this.keyDirection, 0.3);
                 }
                 keySwitch.userData.isPressed = shouldPress;
             }

        });

        this.renderer.render( this.scene, this.camera );
    }
}