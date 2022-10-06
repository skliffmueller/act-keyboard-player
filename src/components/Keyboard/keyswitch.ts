import * as THREE from "three";
import KeyswitchObj from "./models/keyswitch";

export class KeySwitch {
    static createMesh(buffer, imageData) {
        const texture = new THREE.DataTexture(imageData.data, imageData.width, imageData.height);
        texture.needsUpdate = true;
        const geometry = new THREE.BufferGeometry();

        texture.flipY = false;

        geometry.setIndex( buffer.indices );
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( buffer.positions, 3 ) );
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( buffer.vertexNormals, 3 ) );
        geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( buffer.textureCoordinates, 2 ) );


        const material = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x666666, shininess: 42, map: texture, transparent: true });

        return new THREE.Mesh( geometry, material );
    }

    static createBuffer(width, length, height) {
        const halfWidth = width/2;
        const halfHeight = height/2;
        const halfLength = length/2;

        const vertexPositionData = [...KeyswitchObj.positions];
        const normalData = [...KeyswitchObj.vertexNormals];
        const indexData = [...KeyswitchObj.indicies];

        const spriteWidth = height+(height*2);
        const spriteHeight = (length*2)+(height*2);

        const heightWidth = height / spriteWidth;
        const forthWidth = heightWidth / 4;
        const offsetHeightWidth = 1 - heightWidth;
        const heightHeight = height / spriteHeight;
        const lengthHeight = length / spriteHeight;
        const lengthHeightHeight = lengthHeight + heightHeight;
        const offsetLengthHeight = 1 - lengthHeight;

        const textureCoordData = [
            // Front 1
            heightWidth, 1,
            heightWidth + forthWidth, 1,
            heightWidth + forthWidth, offsetLengthHeight,
            heightWidth, offsetLengthHeight,

            // Front 2
            heightWidth + forthWidth, 1,
            heightWidth + (forthWidth * 2), 1,
            heightWidth + (forthWidth * 2), offsetLengthHeight,
            heightWidth + forthWidth, offsetLengthHeight,

            // Front 3
            heightWidth + (forthWidth * 2), 1,
            heightWidth + (forthWidth * 3), 1,
            heightWidth + (forthWidth * 3), offsetLengthHeight,
            heightWidth + (forthWidth * 2), offsetLengthHeight,

            // Front 4
            heightWidth + (forthWidth * 3), 1,
            offsetHeightWidth, 1,
            offsetHeightWidth, offsetLengthHeight,
            heightWidth + (forthWidth * 3), offsetLengthHeight,

            // Back
            heightWidth + forthWidth, lengthHeightHeight,
            heightWidth + forthWidth, heightHeight,
            heightWidth, heightHeight,
            heightWidth, lengthHeightHeight,

            // Back
            heightWidth + (forthWidth * 2), lengthHeightHeight,
            heightWidth + (forthWidth * 2), heightHeight,
            heightWidth + forthWidth, heightHeight,
            heightWidth + forthWidth, lengthHeightHeight,

            // Back
            heightWidth + (forthWidth * 3), lengthHeightHeight,
            heightWidth + (forthWidth * 3), heightHeight,
            heightWidth + (forthWidth * 2), heightHeight,
            heightWidth + (forthWidth * 2), lengthHeightHeight,

            // Back
            heightWidth + (forthWidth * 4), lengthHeightHeight,
            heightWidth + (forthWidth * 4), heightHeight,
            heightWidth + (forthWidth * 3), heightHeight,
            heightWidth + (forthWidth * 3), lengthHeightHeight,

            // Top 1
            heightWidth, lengthHeightHeight,
            heightWidth, offsetLengthHeight,
            heightWidth + forthWidth, offsetLengthHeight,
            heightWidth + forthWidth, lengthHeightHeight,

            // Top 2
            heightWidth + forthWidth, lengthHeightHeight,
            heightWidth + forthWidth, offsetLengthHeight,
            heightWidth + (forthWidth * 2), offsetLengthHeight,
            heightWidth + (forthWidth * 2), lengthHeightHeight,

            // Top 3
            heightWidth + (forthWidth * 2), lengthHeightHeight,
            heightWidth + (forthWidth * 2), offsetLengthHeight,
            heightWidth + (forthWidth * 3), offsetLengthHeight,
            heightWidth + (forthWidth * 3), lengthHeightHeight,

            // Top 4
            heightWidth + (forthWidth * 3), lengthHeightHeight,
            heightWidth + (forthWidth * 3), offsetLengthHeight,
            heightWidth + (forthWidth * 4), offsetLengthHeight,
            heightWidth + (forthWidth * 4), lengthHeightHeight,

            // Right
            offsetHeightWidth, heightHeight,
            offsetHeightWidth, lengthHeightHeight,
            1,lengthHeightHeight,
            1, heightHeight,

            // Left
            heightWidth, heightHeight,
            0, heightHeight,
            0, lengthHeightHeight,
            heightWidth, lengthHeightHeight,
        ];




        const halfWidthSubPadding = halfWidth - 0.2;
        for(let i = 0;i < vertexPositionData.length; i += 3) {
            if(Math.abs(vertexPositionData[i]) == 1.0) {
                vertexPositionData[i] = vertexPositionData[i] > 0 ? halfWidth : -halfWidth;
            } else if (Math.abs(vertexPositionData[i]) == 0.8) {
                vertexPositionData[i] = vertexPositionData[i] > 0 ? halfWidthSubPadding : -halfWidthSubPadding;
            } else {
                vertexPositionData[i] = vertexPositionData[i] * halfWidth;
            }
            vertexPositionData[i+1] = vertexPositionData[i+1] * halfLength;
            vertexPositionData[i+2] = vertexPositionData[i+2] * halfHeight;
        }
        return {
            positions: new Float32Array(vertexPositionData),
            textureCoordinates: new Float32Array(textureCoordData),
            vertexNormals: new Float32Array(normalData),
            indices: indexData,
        }
    }
}