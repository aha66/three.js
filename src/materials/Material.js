/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Material = function () {

	Object.defineProperty( this, 'id', { value: THREE.MaterialIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Material';

	this.side = THREE.FrontSide;

	this.opacity = 1;
	this.transparent = false;

	this.blending = THREE.NormalBlending;

	this.blendSrc = THREE.SrcAlphaFactor;
	this.blendDst = THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = THREE.AddEquation;
	this.blendSrcAlpha = null;
	this.blendDstAlpha = null;
	this.blendEquationAlpha = null;

	this.depthFunc = THREE.LessEqualDepth;
	this.depthTest = true;
	this.depthWrite = true;

	this.colorWrite = true;

	this.polygonOffset = false;
	this.polygonOffsetFactor = 0;
	this.polygonOffsetUnits = 0;

	this.alphaTest = 0;

	this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

	this.visible = true;

	this._needsUpdate = true;

};

THREE.Material.prototype = {

	constructor: THREE.Material,

	get needsUpdate () {

		return this._needsUpdate;

	},

	set needsUpdate ( value ) {

		if ( value === true ) this.update();

		this._needsUpdate = value;

	},

	setValues: function ( values ) {

		if ( values === undefined ) return;

		for ( var key in values ) {

			var newValue = values[ key ];

			if ( newValue === undefined ) {

				console.warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			if ( key in this ) {

				var currentValue = this[ key ];

				if ( currentValue instanceof THREE.Color ) {

					currentValue.set( newValue );

				} else if ( currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ) {

					currentValue.copy( newValue );

				} else if ( key === 'overdraw' ) {

					// ensure overdraw is backwards-compatable with legacy boolean type
					this[ key ] = Number( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		}

	},

	toJSON: function ( meta ) {

		var data = {
			metadata: {
				version: 4.4,
				type: 'Material',
				generator: 'Material.toJSON'
			}
		};

		// standard Material serialization
		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( this.color instanceof THREE.Color ) data.color = this.color.getHex();
		if ( this.emissive instanceof THREE.Color ) data.emissive = this.emissive.getHex();
		if ( this.specular instanceof THREE.Color ) data.specular = this.specular.getHex();
		if ( this.shininess !== undefined ) data.shininess = this.shininess;

		if ( this.map instanceof THREE.Texture ) data.map = this.map.toJSON( meta ).uuid;
		if ( this.alphaMap instanceof THREE.Texture ) data.alphaMap = this.alphaMap.toJSON( meta ).uuid;
		if ( this.lightMap instanceof THREE.Texture ) data.lightMap = this.lightMap.toJSON( meta ).uuid;
		if ( this.bumpMap instanceof THREE.Texture ) {
			data.bumpMap = this.bumpMap.toJSON( meta ).uuid;
			data.bumpScale = this.bumpScale;
		}
		if ( this.normalMap instanceof THREE.Texture ) {
			data.normalMap = this.normalMap.toJSON( meta ).uuid;
			data.normalScale = this.normalScale; // Removed for now, causes issue in editor ui.js
		}
		if ( this.specularMap instanceof THREE.Texture ) data.specularMap = this.specularMap.toJSON( meta ).uuid;
		if ( this.envMap instanceof THREE.Texture ) {
			data.envMap = this.envMap.toJSON( meta ).uuid;
			data.reflectivity = this.reflectivity; // Scale behind envMap
		}

		if ( this.size !== undefined ) data.size = this.size;
		if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

		if ( this.vertexColors !== undefined && this.vertexColors !== THREE.NoColors ) data.vertexColors = this.vertexColors;
		if ( this.shading !== undefined && this.shading !== THREE.SmoothShading ) data.shading = this.shading;
		if ( this.blending !== undefined && this.blending !== THREE.NormalBlending ) data.blending = this.blending;
		if ( this.side !== undefined && this.side !== THREE.FrontSide ) data.side = this.side;

		if ( this.opacity < 1 ) data.opacity = this.opacity;
		if ( this.transparent === true ) data.transparent = this.transparent;
		if ( this.wireframe === true ) data.wireframe = this.wireframe;

		return data;

	},

	clone: function ( material ) {

		if ( material === undefined ) material = new THREE.Material();

		material.name = this.name;

		material.side = this.side;

		material.opacity = this.opacity;
		material.transparent = this.transparent;

		material.blending = this.blending;

		material.blendSrc = this.blendSrc;
		material.blendDst = this.blendDst;
		material.blendEquation = this.blendEquation;
		material.blendSrcAlpha = this.blendSrcAlpha;
		material.blendDstAlpha = this.blendDstAlpha;
		material.blendEquationAlpha = this.blendEquationAlpha;

		material.depthFunc = this.depthFunc;
		material.depthTest = this.depthTest;
		material.depthWrite = this.depthWrite;

		material.polygonOffset = this.polygonOffset;
		material.polygonOffsetFactor = this.polygonOffsetFactor;
		material.polygonOffsetUnits = this.polygonOffsetUnits;

		material.alphaTest = this.alphaTest;

		material.overdraw = this.overdraw;

		material.visible = this.visible;

		return material;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Material.prototype );

THREE.MaterialIdCount = 0;
