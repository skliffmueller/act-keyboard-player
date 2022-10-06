import * as THREE from "three";
import KeyfaceObj from "./models/keyface";

export class KeyBackFace {
    static createMesh(buffer, imageData) {
        const texture = new THREE.DataTexture(imageData.data, imageData.width, imageData.height);
        texture.needsUpdate = true;
        const geometry = new THREE.BufferGeometry();

        texture.flipY = false;

        geometry.setIndex( buffer.indices );
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( buffer.positions, 3 ) );
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( buffer.vertexNormals, 3 ) );
        geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( buffer.textureCoordinates, 2 ) );


        const material = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x999999, shininess: 40, map: texture, transparent: true });

        return new THREE.Mesh( geometry, material );
    }
    static createBuffer(width, length, height) {
        const halfWidth = width/2;
        const halfHeight = height/2;
        const halfLength = length/2;

        const vertexPositionData = [...KeyfaceObj.positions];
        const normalData = [...KeyfaceObj.vertexNormals];
        const indexData = [...KeyfaceObj.indicies];
        // 18x26 ( - ()
        const spriteWidth = height+(height*2);
        const spriteHeight = (length*2)+(height*2);

        const heightWidth = height / spriteWidth;
        const forthWidth = heightWidth / 4;
        const offsetHeightWidth = 1 - heightWidth;
        const heightHeight = height / spriteHeight;
        const lengthHeight = length / spriteHeight;
        const lengthHeightHeight = lengthHeight + heightHeight;
        const offsetLengthHeight = 1 - lengthHeight;

        let textureCoordData = [
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

        for(let i = 0;i < vertexPositionData.length; i += 3) {
            vertexPositionData[i] = vertexPositionData[i] * halfWidth;
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