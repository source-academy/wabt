"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/class-transformer/cjs/enums/transformation-type.enum.js
var require_transformation_type_enum = __commonJS({
  "node_modules/class-transformer/cjs/enums/transformation-type.enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransformationType = void 0;
    var TransformationType;
    (function(TransformationType2) {
      TransformationType2[TransformationType2["PLAIN_TO_CLASS"] = 0] = "PLAIN_TO_CLASS";
      TransformationType2[TransformationType2["CLASS_TO_PLAIN"] = 1] = "CLASS_TO_PLAIN";
      TransformationType2[TransformationType2["CLASS_TO_CLASS"] = 2] = "CLASS_TO_CLASS";
    })(TransformationType = exports.TransformationType || (exports.TransformationType = {}));
  }
});

// node_modules/class-transformer/cjs/enums/index.js
var require_enums = __commonJS({
  "node_modules/class-transformer/cjs/enums/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_transformation_type_enum(), exports);
  }
});

// node_modules/class-transformer/cjs/MetadataStorage.js
var require_MetadataStorage = __commonJS({
  "node_modules/class-transformer/cjs/MetadataStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetadataStorage = void 0;
    var enums_1 = require_enums();
    var MetadataStorage = class {
      constructor() {
        this._typeMetadatas = /* @__PURE__ */ new Map();
        this._transformMetadatas = /* @__PURE__ */ new Map();
        this._exposeMetadatas = /* @__PURE__ */ new Map();
        this._excludeMetadatas = /* @__PURE__ */ new Map();
        this._ancestorsMap = /* @__PURE__ */ new Map();
      }
      // -------------------------------------------------------------------------
      // Adder Methods
      // -------------------------------------------------------------------------
      addTypeMetadata(metadata) {
        if (!this._typeMetadatas.has(metadata.target)) {
          this._typeMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        this._typeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
      }
      addTransformMetadata(metadata) {
        if (!this._transformMetadatas.has(metadata.target)) {
          this._transformMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        if (!this._transformMetadatas.get(metadata.target).has(metadata.propertyName)) {
          this._transformMetadatas.get(metadata.target).set(metadata.propertyName, []);
        }
        this._transformMetadatas.get(metadata.target).get(metadata.propertyName).push(metadata);
      }
      addExposeMetadata(metadata) {
        if (!this._exposeMetadatas.has(metadata.target)) {
          this._exposeMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        this._exposeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
      }
      addExcludeMetadata(metadata) {
        if (!this._excludeMetadatas.has(metadata.target)) {
          this._excludeMetadatas.set(metadata.target, /* @__PURE__ */ new Map());
        }
        this._excludeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
      }
      // -------------------------------------------------------------------------
      // Public Methods
      // -------------------------------------------------------------------------
      findTransformMetadatas(target, propertyName, transformationType) {
        return this.findMetadatas(this._transformMetadatas, target, propertyName).filter((metadata) => {
          if (!metadata.options)
            return true;
          if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
            return true;
          if (metadata.options.toClassOnly === true) {
            return transformationType === enums_1.TransformationType.CLASS_TO_CLASS || transformationType === enums_1.TransformationType.PLAIN_TO_CLASS;
          }
          if (metadata.options.toPlainOnly === true) {
            return transformationType === enums_1.TransformationType.CLASS_TO_PLAIN;
          }
          return true;
        });
      }
      findExcludeMetadata(target, propertyName) {
        return this.findMetadata(this._excludeMetadatas, target, propertyName);
      }
      findExposeMetadata(target, propertyName) {
        return this.findMetadata(this._exposeMetadatas, target, propertyName);
      }
      findExposeMetadataByCustomName(target, name) {
        return this.getExposedMetadatas(target).find((metadata) => {
          return metadata.options && metadata.options.name === name;
        });
      }
      findTypeMetadata(target, propertyName) {
        return this.findMetadata(this._typeMetadatas, target, propertyName);
      }
      getStrategy(target) {
        const excludeMap = this._excludeMetadatas.get(target);
        const exclude = excludeMap && excludeMap.get(void 0);
        const exposeMap = this._exposeMetadatas.get(target);
        const expose = exposeMap && exposeMap.get(void 0);
        if (exclude && expose || !exclude && !expose)
          return "none";
        return exclude ? "excludeAll" : "exposeAll";
      }
      getExposedMetadatas(target) {
        return this.getMetadata(this._exposeMetadatas, target);
      }
      getExcludedMetadatas(target) {
        return this.getMetadata(this._excludeMetadatas, target);
      }
      getExposedProperties(target, transformationType) {
        return this.getExposedMetadatas(target).filter((metadata) => {
          if (!metadata.options)
            return true;
          if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
            return true;
          if (metadata.options.toClassOnly === true) {
            return transformationType === enums_1.TransformationType.CLASS_TO_CLASS || transformationType === enums_1.TransformationType.PLAIN_TO_CLASS;
          }
          if (metadata.options.toPlainOnly === true) {
            return transformationType === enums_1.TransformationType.CLASS_TO_PLAIN;
          }
          return true;
        }).map((metadata) => metadata.propertyName);
      }
      getExcludedProperties(target, transformationType) {
        return this.getExcludedMetadatas(target).filter((metadata) => {
          if (!metadata.options)
            return true;
          if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
            return true;
          if (metadata.options.toClassOnly === true) {
            return transformationType === enums_1.TransformationType.CLASS_TO_CLASS || transformationType === enums_1.TransformationType.PLAIN_TO_CLASS;
          }
          if (metadata.options.toPlainOnly === true) {
            return transformationType === enums_1.TransformationType.CLASS_TO_PLAIN;
          }
          return true;
        }).map((metadata) => metadata.propertyName);
      }
      clear() {
        this._typeMetadatas.clear();
        this._exposeMetadatas.clear();
        this._excludeMetadatas.clear();
        this._ancestorsMap.clear();
      }
      // -------------------------------------------------------------------------
      // Private Methods
      // -------------------------------------------------------------------------
      getMetadata(metadatas, target) {
        const metadataFromTargetMap = metadatas.get(target);
        let metadataFromTarget;
        if (metadataFromTargetMap) {
          metadataFromTarget = Array.from(metadataFromTargetMap.values()).filter((meta) => meta.propertyName !== void 0);
        }
        const metadataFromAncestors = [];
        for (const ancestor of this.getAncestors(target)) {
          const ancestorMetadataMap = metadatas.get(ancestor);
          if (ancestorMetadataMap) {
            const metadataFromAncestor = Array.from(ancestorMetadataMap.values()).filter((meta) => meta.propertyName !== void 0);
            metadataFromAncestors.push(...metadataFromAncestor);
          }
        }
        return metadataFromAncestors.concat(metadataFromTarget || []);
      }
      findMetadata(metadatas, target, propertyName) {
        const metadataFromTargetMap = metadatas.get(target);
        if (metadataFromTargetMap) {
          const metadataFromTarget = metadataFromTargetMap.get(propertyName);
          if (metadataFromTarget) {
            return metadataFromTarget;
          }
        }
        for (const ancestor of this.getAncestors(target)) {
          const ancestorMetadataMap = metadatas.get(ancestor);
          if (ancestorMetadataMap) {
            const ancestorResult = ancestorMetadataMap.get(propertyName);
            if (ancestorResult) {
              return ancestorResult;
            }
          }
        }
        return void 0;
      }
      findMetadatas(metadatas, target, propertyName) {
        const metadataFromTargetMap = metadatas.get(target);
        let metadataFromTarget;
        if (metadataFromTargetMap) {
          metadataFromTarget = metadataFromTargetMap.get(propertyName);
        }
        const metadataFromAncestorsTarget = [];
        for (const ancestor of this.getAncestors(target)) {
          const ancestorMetadataMap = metadatas.get(ancestor);
          if (ancestorMetadataMap) {
            if (ancestorMetadataMap.has(propertyName)) {
              metadataFromAncestorsTarget.push(...ancestorMetadataMap.get(propertyName));
            }
          }
        }
        return metadataFromAncestorsTarget.slice().reverse().concat((metadataFromTarget || []).slice().reverse());
      }
      getAncestors(target) {
        if (!target)
          return [];
        if (!this._ancestorsMap.has(target)) {
          const ancestors = [];
          for (let baseClass = Object.getPrototypeOf(target.prototype.constructor); typeof baseClass.prototype !== "undefined"; baseClass = Object.getPrototypeOf(baseClass.prototype.constructor)) {
            ancestors.push(baseClass);
          }
          this._ancestorsMap.set(target, ancestors);
        }
        return this._ancestorsMap.get(target);
      }
    };
    exports.MetadataStorage = MetadataStorage;
  }
});

// node_modules/class-transformer/cjs/storage.js
var require_storage = __commonJS({
  "node_modules/class-transformer/cjs/storage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultMetadataStorage = void 0;
    var MetadataStorage_1 = require_MetadataStorage();
    exports.defaultMetadataStorage = new MetadataStorage_1.MetadataStorage();
  }
});

// node_modules/class-transformer/cjs/utils/get-global.util.js
var require_get_global_util = __commonJS({
  "node_modules/class-transformer/cjs/utils/get-global.util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getGlobal = void 0;
    function getGlobal() {
      if (typeof globalThis !== "undefined") {
        return globalThis;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof self !== "undefined") {
        return self;
      }
    }
    exports.getGlobal = getGlobal;
  }
});

// node_modules/class-transformer/cjs/utils/is-promise.util.js
var require_is_promise_util = __commonJS({
  "node_modules/class-transformer/cjs/utils/is-promise.util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isPromise = void 0;
    function isPromise(p) {
      return p !== null && typeof p === "object" && typeof p.then === "function";
    }
    exports.isPromise = isPromise;
  }
});

// node_modules/class-transformer/cjs/utils/index.js
var require_utils = __commonJS({
  "node_modules/class-transformer/cjs/utils/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_get_global_util(), exports);
    __exportStar(require_is_promise_util(), exports);
  }
});

// node_modules/class-transformer/cjs/TransformOperationExecutor.js
var require_TransformOperationExecutor = __commonJS({
  "node_modules/class-transformer/cjs/TransformOperationExecutor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransformOperationExecutor = void 0;
    var storage_1 = require_storage();
    var enums_1 = require_enums();
    var utils_1 = require_utils();
    function instantiateArrayType(arrayType) {
      const array = new arrayType();
      if (!(array instanceof Set) && !("push" in array)) {
        return [];
      }
      return array;
    }
    var TransformOperationExecutor = class {
      // -------------------------------------------------------------------------
      // Constructor
      // -------------------------------------------------------------------------
      constructor(transformationType, options) {
        this.transformationType = transformationType;
        this.options = options;
        this.recursionStack = /* @__PURE__ */ new Set();
      }
      // -------------------------------------------------------------------------
      // Public Methods
      // -------------------------------------------------------------------------
      transform(source, value, targetType, arrayType, isMap, level = 0) {
        if (Array.isArray(value) || value instanceof Set) {
          const newValue = arrayType && this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS ? instantiateArrayType(arrayType) : [];
          value.forEach((subValue, index) => {
            const subSource = source ? source[index] : void 0;
            if (!this.options.enableCircularCheck || !this.isCircular(subValue)) {
              let realTargetType;
              if (typeof targetType !== "function" && targetType && targetType.options && targetType.options.discriminator && targetType.options.discriminator.property && targetType.options.discriminator.subTypes) {
                if (this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS) {
                  realTargetType = targetType.options.discriminator.subTypes.find((subType) => subType.name === subValue[targetType.options.discriminator.property]);
                  const options = { newObject: newValue, object: subValue, property: void 0 };
                  const newType = targetType.typeFunction(options);
                  realTargetType === void 0 ? realTargetType = newType : realTargetType = realTargetType.value;
                  if (!targetType.options.keepDiscriminatorProperty)
                    delete subValue[targetType.options.discriminator.property];
                }
                if (this.transformationType === enums_1.TransformationType.CLASS_TO_CLASS) {
                  realTargetType = subValue.constructor;
                }
                if (this.transformationType === enums_1.TransformationType.CLASS_TO_PLAIN) {
                  subValue[targetType.options.discriminator.property] = targetType.options.discriminator.subTypes.find((subType) => subType.value === subValue.constructor).name;
                }
              } else {
                realTargetType = targetType;
              }
              const value2 = this.transform(subSource, subValue, realTargetType, void 0, subValue instanceof Map, level + 1);
              if (newValue instanceof Set) {
                newValue.add(value2);
              } else {
                newValue.push(value2);
              }
            } else if (this.transformationType === enums_1.TransformationType.CLASS_TO_CLASS) {
              if (newValue instanceof Set) {
                newValue.add(subValue);
              } else {
                newValue.push(subValue);
              }
            }
          });
          return newValue;
        } else if (targetType === String && !isMap) {
          if (value === null || value === void 0)
            return value;
          return String(value);
        } else if (targetType === Number && !isMap) {
          if (value === null || value === void 0)
            return value;
          return Number(value);
        } else if (targetType === Boolean && !isMap) {
          if (value === null || value === void 0)
            return value;
          return Boolean(value);
        } else if ((targetType === Date || value instanceof Date) && !isMap) {
          if (value instanceof Date) {
            return new Date(value.valueOf());
          }
          if (value === null || value === void 0)
            return value;
          return new Date(value);
        } else if (!!(0, utils_1.getGlobal)().Buffer && (targetType === Buffer || value instanceof Buffer) && !isMap) {
          if (value === null || value === void 0)
            return value;
          return Buffer.from(value);
        } else if ((0, utils_1.isPromise)(value) && !isMap) {
          return new Promise((resolve, reject) => {
            value.then((data) => resolve(this.transform(void 0, data, targetType, void 0, void 0, level + 1)), reject);
          });
        } else if (!isMap && value !== null && typeof value === "object" && typeof value.then === "function") {
          return value;
        } else if (typeof value === "object" && value !== null) {
          if (!targetType && value.constructor !== Object)
            if (!Array.isArray(value) && value.constructor === Array) {
            } else {
              targetType = value.constructor;
            }
          if (!targetType && source)
            targetType = source.constructor;
          if (this.options.enableCircularCheck) {
            this.recursionStack.add(value);
          }
          const keys = this.getKeys(targetType, value, isMap);
          let newValue = source ? source : {};
          if (!source && (this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS || this.transformationType === enums_1.TransformationType.CLASS_TO_CLASS)) {
            if (isMap) {
              newValue = /* @__PURE__ */ new Map();
            } else if (targetType) {
              newValue = new targetType();
            } else {
              newValue = {};
            }
          }
          for (const key of keys) {
            if (key === "__proto__" || key === "constructor") {
              continue;
            }
            const valueKey = key;
            let newValueKey = key, propertyName = key;
            if (!this.options.ignoreDecorators && targetType) {
              if (this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS) {
                const exposeMetadata = storage_1.defaultMetadataStorage.findExposeMetadataByCustomName(targetType, key);
                if (exposeMetadata) {
                  propertyName = exposeMetadata.propertyName;
                  newValueKey = exposeMetadata.propertyName;
                }
              } else if (this.transformationType === enums_1.TransformationType.CLASS_TO_PLAIN || this.transformationType === enums_1.TransformationType.CLASS_TO_CLASS) {
                const exposeMetadata = storage_1.defaultMetadataStorage.findExposeMetadata(targetType, key);
                if (exposeMetadata && exposeMetadata.options && exposeMetadata.options.name) {
                  newValueKey = exposeMetadata.options.name;
                }
              }
            }
            let subValue = void 0;
            if (this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS) {
              subValue = value[valueKey];
            } else {
              if (value instanceof Map) {
                subValue = value.get(valueKey);
              } else if (value[valueKey] instanceof Function) {
                subValue = value[valueKey]();
              } else {
                subValue = value[valueKey];
              }
            }
            let type = void 0, isSubValueMap = subValue instanceof Map;
            if (targetType && isMap) {
              type = targetType;
            } else if (targetType) {
              const metadata = storage_1.defaultMetadataStorage.findTypeMetadata(targetType, propertyName);
              if (metadata) {
                const options = { newObject: newValue, object: value, property: propertyName };
                const newType = metadata.typeFunction ? metadata.typeFunction(options) : metadata.reflectedType;
                if (metadata.options && metadata.options.discriminator && metadata.options.discriminator.property && metadata.options.discriminator.subTypes) {
                  if (!(value[valueKey] instanceof Array)) {
                    if (this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS) {
                      type = metadata.options.discriminator.subTypes.find((subType) => {
                        if (subValue && subValue instanceof Object && metadata.options.discriminator.property in subValue) {
                          return subType.name === subValue[metadata.options.discriminator.property];
                        }
                      });
                      type === void 0 ? type = newType : type = type.value;
                      if (!metadata.options.keepDiscriminatorProperty) {
                        if (subValue && subValue instanceof Object && metadata.options.discriminator.property in subValue) {
                          delete subValue[metadata.options.discriminator.property];
                        }
                      }
                    }
                    if (this.transformationType === enums_1.TransformationType.CLASS_TO_CLASS) {
                      type = subValue.constructor;
                    }
                    if (this.transformationType === enums_1.TransformationType.CLASS_TO_PLAIN) {
                      if (subValue) {
                        subValue[metadata.options.discriminator.property] = metadata.options.discriminator.subTypes.find((subType) => subType.value === subValue.constructor).name;
                      }
                    }
                  } else {
                    type = metadata;
                  }
                } else {
                  type = newType;
                }
                isSubValueMap = isSubValueMap || metadata.reflectedType === Map;
              } else if (this.options.targetMaps) {
                this.options.targetMaps.filter((map) => map.target === targetType && !!map.properties[propertyName]).forEach((map) => type = map.properties[propertyName]);
              } else if (this.options.enableImplicitConversion && this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS) {
                const reflectedType = Reflect.getMetadata("design:type", targetType.prototype, propertyName);
                if (reflectedType) {
                  type = reflectedType;
                }
              }
            }
            const arrayType2 = Array.isArray(value[valueKey]) ? this.getReflectedType(targetType, propertyName) : void 0;
            const subSource = source ? source[valueKey] : void 0;
            if (newValue.constructor.prototype) {
              const descriptor = Object.getOwnPropertyDescriptor(newValue.constructor.prototype, newValueKey);
              if ((this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS || this.transformationType === enums_1.TransformationType.CLASS_TO_CLASS) && // eslint-disable-next-line @typescript-eslint/unbound-method
              (descriptor && !descriptor.set || newValue[newValueKey] instanceof Function))
                continue;
            }
            if (!this.options.enableCircularCheck || !this.isCircular(subValue)) {
              const transformKey = this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS ? newValueKey : key;
              let finalValue;
              if (this.transformationType === enums_1.TransformationType.CLASS_TO_PLAIN) {
                finalValue = value[transformKey];
                finalValue = this.applyCustomTransformations(finalValue, targetType, transformKey, value, this.transformationType);
                finalValue = value[transformKey] === finalValue ? subValue : finalValue;
                finalValue = this.transform(subSource, finalValue, type, arrayType2, isSubValueMap, level + 1);
              } else {
                if (subValue === void 0 && this.options.exposeDefaultValues) {
                  finalValue = newValue[newValueKey];
                } else {
                  finalValue = this.transform(subSource, subValue, type, arrayType2, isSubValueMap, level + 1);
                  finalValue = this.applyCustomTransformations(finalValue, targetType, transformKey, value, this.transformationType);
                }
              }
              if (finalValue !== void 0 || this.options.exposeUnsetFields) {
                if (newValue instanceof Map) {
                  newValue.set(newValueKey, finalValue);
                } else {
                  newValue[newValueKey] = finalValue;
                }
              }
            } else if (this.transformationType === enums_1.TransformationType.CLASS_TO_CLASS) {
              let finalValue = subValue;
              finalValue = this.applyCustomTransformations(finalValue, targetType, key, value, this.transformationType);
              if (finalValue !== void 0 || this.options.exposeUnsetFields) {
                if (newValue instanceof Map) {
                  newValue.set(newValueKey, finalValue);
                } else {
                  newValue[newValueKey] = finalValue;
                }
              }
            }
          }
          if (this.options.enableCircularCheck) {
            this.recursionStack.delete(value);
          }
          return newValue;
        } else {
          return value;
        }
      }
      applyCustomTransformations(value, target, key, obj, transformationType) {
        let metadatas = storage_1.defaultMetadataStorage.findTransformMetadatas(target, key, this.transformationType);
        if (this.options.version !== void 0) {
          metadatas = metadatas.filter((metadata) => {
            if (!metadata.options)
              return true;
            return this.checkVersion(metadata.options.since, metadata.options.until);
          });
        }
        if (this.options.groups && this.options.groups.length) {
          metadatas = metadatas.filter((metadata) => {
            if (!metadata.options)
              return true;
            return this.checkGroups(metadata.options.groups);
          });
        } else {
          metadatas = metadatas.filter((metadata) => {
            return !metadata.options || !metadata.options.groups || !metadata.options.groups.length;
          });
        }
        metadatas.forEach((metadata) => {
          value = metadata.transformFn({ value, key, obj, type: transformationType, options: this.options });
        });
        return value;
      }
      // preventing circular references
      isCircular(object) {
        return this.recursionStack.has(object);
      }
      getReflectedType(target, propertyName) {
        if (!target)
          return void 0;
        const meta = storage_1.defaultMetadataStorage.findTypeMetadata(target, propertyName);
        return meta ? meta.reflectedType : void 0;
      }
      getKeys(target, object, isMap) {
        let strategy = storage_1.defaultMetadataStorage.getStrategy(target);
        if (strategy === "none")
          strategy = this.options.strategy || "exposeAll";
        let keys = [];
        if (strategy === "exposeAll" || isMap) {
          if (object instanceof Map) {
            keys = Array.from(object.keys());
          } else {
            keys = Object.keys(object);
          }
        }
        if (isMap) {
          return keys;
        }
        if (this.options.ignoreDecorators && this.options.excludeExtraneousValues && target) {
          const exposedProperties = storage_1.defaultMetadataStorage.getExposedProperties(target, this.transformationType);
          const excludedProperties = storage_1.defaultMetadataStorage.getExcludedProperties(target, this.transformationType);
          keys = [...exposedProperties, ...excludedProperties];
        }
        if (!this.options.ignoreDecorators && target) {
          let exposedProperties = storage_1.defaultMetadataStorage.getExposedProperties(target, this.transformationType);
          if (this.transformationType === enums_1.TransformationType.PLAIN_TO_CLASS) {
            exposedProperties = exposedProperties.map((key) => {
              const exposeMetadata = storage_1.defaultMetadataStorage.findExposeMetadata(target, key);
              if (exposeMetadata && exposeMetadata.options && exposeMetadata.options.name) {
                return exposeMetadata.options.name;
              }
              return key;
            });
          }
          if (this.options.excludeExtraneousValues) {
            keys = exposedProperties;
          } else {
            keys = keys.concat(exposedProperties);
          }
          const excludedProperties = storage_1.defaultMetadataStorage.getExcludedProperties(target, this.transformationType);
          if (excludedProperties.length > 0) {
            keys = keys.filter((key) => {
              return !excludedProperties.includes(key);
            });
          }
          if (this.options.version !== void 0) {
            keys = keys.filter((key) => {
              const exposeMetadata = storage_1.defaultMetadataStorage.findExposeMetadata(target, key);
              if (!exposeMetadata || !exposeMetadata.options)
                return true;
              return this.checkVersion(exposeMetadata.options.since, exposeMetadata.options.until);
            });
          }
          if (this.options.groups && this.options.groups.length) {
            keys = keys.filter((key) => {
              const exposeMetadata = storage_1.defaultMetadataStorage.findExposeMetadata(target, key);
              if (!exposeMetadata || !exposeMetadata.options)
                return true;
              return this.checkGroups(exposeMetadata.options.groups);
            });
          } else {
            keys = keys.filter((key) => {
              const exposeMetadata = storage_1.defaultMetadataStorage.findExposeMetadata(target, key);
              return !exposeMetadata || !exposeMetadata.options || !exposeMetadata.options.groups || !exposeMetadata.options.groups.length;
            });
          }
        }
        if (this.options.excludePrefixes && this.options.excludePrefixes.length) {
          keys = keys.filter((key) => this.options.excludePrefixes.every((prefix) => {
            return key.substr(0, prefix.length) !== prefix;
          }));
        }
        keys = keys.filter((key, index, self2) => {
          return self2.indexOf(key) === index;
        });
        return keys;
      }
      checkVersion(since, until) {
        let decision = true;
        if (decision && since)
          decision = this.options.version >= since;
        if (decision && until)
          decision = this.options.version < until;
        return decision;
      }
      checkGroups(groups) {
        if (!groups)
          return true;
        return this.options.groups.some((optionGroup) => groups.includes(optionGroup));
      }
    };
    exports.TransformOperationExecutor = TransformOperationExecutor;
  }
});

// node_modules/class-transformer/cjs/constants/default-options.constant.js
var require_default_options_constant = __commonJS({
  "node_modules/class-transformer/cjs/constants/default-options.constant.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultOptions = void 0;
    exports.defaultOptions = {
      enableCircularCheck: false,
      enableImplicitConversion: false,
      excludeExtraneousValues: false,
      excludePrefixes: void 0,
      exposeDefaultValues: false,
      exposeUnsetFields: true,
      groups: void 0,
      ignoreDecorators: false,
      strategy: void 0,
      targetMaps: void 0,
      version: void 0
    };
  }
});

// node_modules/class-transformer/cjs/ClassTransformer.js
var require_ClassTransformer = __commonJS({
  "node_modules/class-transformer/cjs/ClassTransformer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassTransformer = void 0;
    var TransformOperationExecutor_1 = require_TransformOperationExecutor();
    var enums_1 = require_enums();
    var default_options_constant_1 = require_default_options_constant();
    var ClassTransformer = class {
      instanceToPlain(object, options) {
        const executor = new TransformOperationExecutor_1.TransformOperationExecutor(enums_1.TransformationType.CLASS_TO_PLAIN, {
          ...default_options_constant_1.defaultOptions,
          ...options
        });
        return executor.transform(void 0, object, void 0, void 0, void 0, void 0);
      }
      classToPlainFromExist(object, plainObject, options) {
        const executor = new TransformOperationExecutor_1.TransformOperationExecutor(enums_1.TransformationType.CLASS_TO_PLAIN, {
          ...default_options_constant_1.defaultOptions,
          ...options
        });
        return executor.transform(plainObject, object, void 0, void 0, void 0, void 0);
      }
      plainToInstance(cls, plain, options) {
        const executor = new TransformOperationExecutor_1.TransformOperationExecutor(enums_1.TransformationType.PLAIN_TO_CLASS, {
          ...default_options_constant_1.defaultOptions,
          ...options
        });
        return executor.transform(void 0, plain, cls, void 0, void 0, void 0);
      }
      plainToClassFromExist(clsObject, plain, options) {
        const executor = new TransformOperationExecutor_1.TransformOperationExecutor(enums_1.TransformationType.PLAIN_TO_CLASS, {
          ...default_options_constant_1.defaultOptions,
          ...options
        });
        return executor.transform(clsObject, plain, void 0, void 0, void 0, void 0);
      }
      instanceToInstance(object, options) {
        const executor = new TransformOperationExecutor_1.TransformOperationExecutor(enums_1.TransformationType.CLASS_TO_CLASS, {
          ...default_options_constant_1.defaultOptions,
          ...options
        });
        return executor.transform(void 0, object, void 0, void 0, void 0, void 0);
      }
      classToClassFromExist(object, fromObject, options) {
        const executor = new TransformOperationExecutor_1.TransformOperationExecutor(enums_1.TransformationType.CLASS_TO_CLASS, {
          ...default_options_constant_1.defaultOptions,
          ...options
        });
        return executor.transform(fromObject, object, void 0, void 0, void 0, void 0);
      }
      serialize(object, options) {
        return JSON.stringify(this.instanceToPlain(object, options));
      }
      /**
       * Deserializes given JSON string to a object of the given class.
       */
      deserialize(cls, json, options) {
        const jsonObject = JSON.parse(json);
        return this.plainToInstance(cls, jsonObject, options);
      }
      /**
       * Deserializes given JSON string to an array of objects of the given class.
       */
      deserializeArray(cls, json, options) {
        const jsonObject = JSON.parse(json);
        return this.plainToInstance(cls, jsonObject, options);
      }
    };
    exports.ClassTransformer = ClassTransformer;
  }
});

// node_modules/class-transformer/cjs/decorators/exclude.decorator.js
var require_exclude_decorator = __commonJS({
  "node_modules/class-transformer/cjs/decorators/exclude.decorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Exclude = void 0;
    var storage_1 = require_storage();
    function Exclude(options = {}) {
      return function(object, propertyName) {
        storage_1.defaultMetadataStorage.addExcludeMetadata({
          target: object instanceof Function ? object : object.constructor,
          propertyName,
          options
        });
      };
    }
    exports.Exclude = Exclude;
  }
});

// node_modules/class-transformer/cjs/decorators/expose.decorator.js
var require_expose_decorator = __commonJS({
  "node_modules/class-transformer/cjs/decorators/expose.decorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Expose = void 0;
    var storage_1 = require_storage();
    function Expose(options = {}) {
      return function(object, propertyName) {
        storage_1.defaultMetadataStorage.addExposeMetadata({
          target: object instanceof Function ? object : object.constructor,
          propertyName,
          options
        });
      };
    }
    exports.Expose = Expose;
  }
});

// node_modules/class-transformer/cjs/decorators/transform-instance-to-instance.decorator.js
var require_transform_instance_to_instance_decorator = __commonJS({
  "node_modules/class-transformer/cjs/decorators/transform-instance-to-instance.decorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransformInstanceToInstance = void 0;
    var ClassTransformer_1 = require_ClassTransformer();
    function TransformInstanceToInstance(params) {
      return function(target, propertyKey, descriptor) {
        const classTransformer = new ClassTransformer_1.ClassTransformer();
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
          const result = originalMethod.apply(this, args);
          const isPromise = !!result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function";
          return isPromise ? result.then((data) => classTransformer.instanceToInstance(data, params)) : classTransformer.instanceToInstance(result, params);
        };
      };
    }
    exports.TransformInstanceToInstance = TransformInstanceToInstance;
  }
});

// node_modules/class-transformer/cjs/decorators/transform-instance-to-plain.decorator.js
var require_transform_instance_to_plain_decorator = __commonJS({
  "node_modules/class-transformer/cjs/decorators/transform-instance-to-plain.decorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransformInstanceToPlain = void 0;
    var ClassTransformer_1 = require_ClassTransformer();
    function TransformInstanceToPlain(params) {
      return function(target, propertyKey, descriptor) {
        const classTransformer = new ClassTransformer_1.ClassTransformer();
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
          const result = originalMethod.apply(this, args);
          const isPromise = !!result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function";
          return isPromise ? result.then((data) => classTransformer.instanceToPlain(data, params)) : classTransformer.instanceToPlain(result, params);
        };
      };
    }
    exports.TransformInstanceToPlain = TransformInstanceToPlain;
  }
});

// node_modules/class-transformer/cjs/decorators/transform-plain-to-instance.decorator.js
var require_transform_plain_to_instance_decorator = __commonJS({
  "node_modules/class-transformer/cjs/decorators/transform-plain-to-instance.decorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TransformPlainToInstance = void 0;
    var ClassTransformer_1 = require_ClassTransformer();
    function TransformPlainToInstance(classType, params) {
      return function(target, propertyKey, descriptor) {
        const classTransformer = new ClassTransformer_1.ClassTransformer();
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
          const result = originalMethod.apply(this, args);
          const isPromise = !!result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function";
          return isPromise ? result.then((data) => classTransformer.plainToInstance(classType, data, params)) : classTransformer.plainToInstance(classType, result, params);
        };
      };
    }
    exports.TransformPlainToInstance = TransformPlainToInstance;
  }
});

// node_modules/class-transformer/cjs/decorators/transform.decorator.js
var require_transform_decorator = __commonJS({
  "node_modules/class-transformer/cjs/decorators/transform.decorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transform = void 0;
    var storage_1 = require_storage();
    function Transform(transformFn, options = {}) {
      return function(target, propertyName) {
        storage_1.defaultMetadataStorage.addTransformMetadata({
          target: target.constructor,
          propertyName,
          transformFn,
          options
        });
      };
    }
    exports.Transform = Transform;
  }
});

// node_modules/class-transformer/cjs/decorators/type.decorator.js
var require_type_decorator = __commonJS({
  "node_modules/class-transformer/cjs/decorators/type.decorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Type = void 0;
    var storage_1 = require_storage();
    function Type(typeFunction, options = {}) {
      return function(target, propertyName) {
        const reflectedType = Reflect.getMetadata("design:type", target, propertyName);
        storage_1.defaultMetadataStorage.addTypeMetadata({
          target: target.constructor,
          propertyName,
          reflectedType,
          typeFunction,
          options
        });
      };
    }
    exports.Type = Type;
  }
});

// node_modules/class-transformer/cjs/decorators/index.js
var require_decorators = __commonJS({
  "node_modules/class-transformer/cjs/decorators/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_exclude_decorator(), exports);
    __exportStar(require_expose_decorator(), exports);
    __exportStar(require_transform_instance_to_instance_decorator(), exports);
    __exportStar(require_transform_instance_to_plain_decorator(), exports);
    __exportStar(require_transform_plain_to_instance_decorator(), exports);
    __exportStar(require_transform_decorator(), exports);
    __exportStar(require_type_decorator(), exports);
  }
});

// node_modules/class-transformer/cjs/interfaces/decorator-options/expose-options.interface.js
var require_expose_options_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/decorator-options/expose-options.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/decorator-options/exclude-options.interface.js
var require_exclude_options_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/decorator-options/exclude-options.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/decorator-options/transform-options.interface.js
var require_transform_options_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/decorator-options/transform-options.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/decorator-options/type-discriminator-descriptor.interface.js
var require_type_discriminator_descriptor_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/decorator-options/type-discriminator-descriptor.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/decorator-options/type-options.interface.js
var require_type_options_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/decorator-options/type-options.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/metadata/exclude-metadata.interface.js
var require_exclude_metadata_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/metadata/exclude-metadata.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/metadata/expose-metadata.interface.js
var require_expose_metadata_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/metadata/expose-metadata.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/metadata/transform-metadata.interface.js
var require_transform_metadata_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/metadata/transform-metadata.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/metadata/transform-fn-params.interface.js
var require_transform_fn_params_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/metadata/transform-fn-params.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/metadata/type-metadata.interface.js
var require_type_metadata_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/metadata/type-metadata.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/class-constructor.type.js
var require_class_constructor_type = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/class-constructor.type.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/class-transformer-options.interface.js
var require_class_transformer_options_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/class-transformer-options.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/target-map.interface.js
var require_target_map_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/target-map.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/type-help-options.interface.js
var require_type_help_options_interface = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/type-help-options.interface.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/class-transformer/cjs/interfaces/index.js
var require_interfaces = __commonJS({
  "node_modules/class-transformer/cjs/interfaces/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_expose_options_interface(), exports);
    __exportStar(require_exclude_options_interface(), exports);
    __exportStar(require_transform_options_interface(), exports);
    __exportStar(require_type_discriminator_descriptor_interface(), exports);
    __exportStar(require_type_options_interface(), exports);
    __exportStar(require_exclude_metadata_interface(), exports);
    __exportStar(require_expose_metadata_interface(), exports);
    __exportStar(require_transform_metadata_interface(), exports);
    __exportStar(require_transform_fn_params_interface(), exports);
    __exportStar(require_type_metadata_interface(), exports);
    __exportStar(require_class_constructor_type(), exports);
    __exportStar(require_class_transformer_options_interface(), exports);
    __exportStar(require_target_map_interface(), exports);
    __exportStar(require_type_help_options_interface(), exports);
  }
});

// node_modules/class-transformer/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/class-transformer/cjs/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deserializeArray = exports.deserialize = exports.serialize = exports.classToClassFromExist = exports.instanceToInstance = exports.plainToClassFromExist = exports.plainToInstance = exports.plainToClass = exports.classToPlainFromExist = exports.instanceToPlain = exports.classToPlain = exports.ClassTransformer = void 0;
    var ClassTransformer_1 = require_ClassTransformer();
    var ClassTransformer_2 = require_ClassTransformer();
    Object.defineProperty(exports, "ClassTransformer", { enumerable: true, get: function() {
      return ClassTransformer_2.ClassTransformer;
    } });
    __exportStar(require_decorators(), exports);
    __exportStar(require_interfaces(), exports);
    __exportStar(require_enums(), exports);
    var classTransformer = new ClassTransformer_1.ClassTransformer();
    function classToPlain(object, options) {
      return classTransformer.instanceToPlain(object, options);
    }
    exports.classToPlain = classToPlain;
    function instanceToPlain2(object, options) {
      return classTransformer.instanceToPlain(object, options);
    }
    exports.instanceToPlain = instanceToPlain2;
    function classToPlainFromExist(object, plainObject, options) {
      return classTransformer.classToPlainFromExist(object, plainObject, options);
    }
    exports.classToPlainFromExist = classToPlainFromExist;
    function plainToClass(cls, plain, options) {
      return classTransformer.plainToInstance(cls, plain, options);
    }
    exports.plainToClass = plainToClass;
    function plainToInstance(cls, plain, options) {
      return classTransformer.plainToInstance(cls, plain, options);
    }
    exports.plainToInstance = plainToInstance;
    function plainToClassFromExist(clsObject, plain, options) {
      return classTransformer.plainToClassFromExist(clsObject, plain, options);
    }
    exports.plainToClassFromExist = plainToClassFromExist;
    function instanceToInstance(object, options) {
      return classTransformer.instanceToInstance(object, options);
    }
    exports.instanceToInstance = instanceToInstance;
    function classToClassFromExist(object, fromObject, options) {
      return classTransformer.classToClassFromExist(object, fromObject, options);
    }
    exports.classToClassFromExist = classToClassFromExist;
    function serialize(object, options) {
      return classTransformer.serialize(object, options);
    }
    exports.serialize = serialize;
    function deserialize(cls, json, options) {
      return classTransformer.deserialize(cls, json, options);
    }
    exports.deserialize = deserialize;
    function deserializeArray(cls, json, options) {
      return classTransformer.deserializeArray(cls, json, options);
    }
    exports.deserializeArray = deserializeArray;
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  compile: () => compile,
  compileParseTree: () => compileParseTree,
  getParseTree: () => getParseTree
});
module.exports = __toCommonJS(src_exports);

// src/common/type.ts
var ValueType = /* @__PURE__ */ ((ValueType2) => {
  ValueType2[ValueType2["I32"] = 0] = "I32";
  ValueType2[ValueType2["I64"] = 1] = "I64";
  ValueType2[ValueType2["F32"] = 2] = "F32";
  ValueType2[ValueType2["F64"] = 3] = "F64";
  ValueType2[ValueType2["V128"] = 4] = "V128";
  ValueType2[ValueType2["I8"] = 5] = "I8";
  ValueType2[ValueType2["I16"] = 6] = "I16";
  ValueType2[ValueType2["FuncRef"] = 7] = "FuncRef";
  ValueType2[ValueType2["ExternRef"] = 8] = "ExternRef";
  ValueType2[ValueType2["Reference"] = 9] = "Reference";
  ValueType2[ValueType2["Func"] = 10] = "Func";
  ValueType2[ValueType2["Struct"] = 11] = "Struct";
  ValueType2[ValueType2["Array"] = 12] = "Array";
  ValueType2[ValueType2["Void"] = 13] = "Void";
  ValueType2[ValueType2["___"] = 14] = "___";
  ValueType2[ValueType2["Any"] = 15] = "Any";
  ValueType2[ValueType2["I8U"] = 16] = "I8U";
  ValueType2[ValueType2["I16U"] = 17] = "I16U";
  ValueType2[ValueType2["I32U"] = 18] = "I32U";
  return ValueType2;
})(ValueType || {});
((ValueType2) => {
  function getValue(t) {
    switch (t) {
      case 0 /* I32 */:
        return 127;
      case 1 /* I64 */:
        return 126;
      case 2 /* F32 */:
        return 125;
      case 3 /* F64 */:
        return 124;
      case 4 /* V128 */:
        return 123;
      case 5 /* I8 */:
        return 122;
      case 6 /* I16 */:
        return 121;
      case 7 /* FuncRef */:
        return 112;
      case 8 /* ExternRef */:
        return 111;
      case 9 /* Reference */:
        return 107;
      case 10 /* Func */:
        return 96;
      case 11 /* Struct */:
        return 95;
      case 12 /* Array */:
        return 94;
      case 13 /* Void */:
        return 64;
      case 14 /* ___ */:
        return -64;
      case 15 /* Any */:
        return 0;
      case 16 /* I8U */:
        return 4;
      case 17 /* I16U */:
        return 6;
      case 18 /* I32U */:
        return 7;
    }
    throw new Error("Unexpected Value Type");
  }
  ValueType2.getValue = getValue;
})(ValueType || (ValueType = {}));

// src/common/opcode.ts
var Opcode;
((Opcode2) => {
  function getReturnType(o) {
    return opcodeData[o][0];
  }
  Opcode2.getReturnType = getReturnType;
  function getParamTypes(o) {
    const params = [
      opcodeData[o][1],
      opcodeData[o][2],
      opcodeData[o][3]
    ].filter((p) => p !== 14 /* ___ */);
    return params;
  }
  Opcode2.getParamTypes = getParamTypes;
  function getParamLength(o) {
    return getParamTypes(o).length;
  }
  Opcode2.getParamLength = getParamLength;
  function getMemSize(o) {
    return opcodeData[o][4];
  }
  Opcode2.getMemSize = getMemSize;
  function getPrefix(o) {
    return opcodeData[o][5];
  }
  Opcode2.getPrefix = getPrefix;
  function getCode(o) {
    return opcodeData[o][6];
  }
  Opcode2.getCode = getCode;
  function getText(o) {
    return opcodeData[o][7];
  }
  Opcode2.getText = getText;
  function getDecompText(o) {
    return opcodeData[o][8];
  }
  Opcode2.getDecompText = getDecompText;
  const opcodeData = {
    [0 /* Unreachable */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 0, "unreachable", ""],
    [1 /* Nop */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 1, "nop", ""],
    [2 /* Block */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 2, "block", ""],
    [3 /* Loop */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 3, "loop", ""],
    [4 /* If */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 4, "if", ""],
    [5 /* Else */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 5, "else", ""],
    [6 /* Try */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 6, "try", ""],
    [7 /* Catch */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 7, "catch", ""],
    [8 /* Throw */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 8, "throw", ""],
    [9 /* Rethrow */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 9, "rethrow", ""],
    [10 /* End */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 11, "end", ""],
    [11 /* Br */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 12, "br", ""],
    [12 /* BrIf */]: [14 /* ___ */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 13, "br_if", ""],
    [13 /* BrTable */]: [14 /* ___ */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 14, "br_table", ""],
    [14 /* Return */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 15, "return", ""],
    [15 /* Call */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 16, "call", ""],
    [16 /* CallIndirect */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 17, "call_indirect", ""],
    [17 /* ReturnCall */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 18, "return_call", ""],
    [18 /* ReturnCallIndirect */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 19, "return_call_indirect", ""],
    [19 /* CallRef */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 20, "call_ref", ""],
    [20 /* Delegate */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 24, "delegate", ""],
    [21 /* CatchAll */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 25, "catch_all", ""],
    [22 /* Drop */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 26, "drop", ""],
    [23 /* Select */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0 /* I32 */, 0, 0, 27, "select", ""],
    [24 /* SelectT */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0 /* I32 */, 0, 0, 28, "select", ""],
    [25 /* LocalGet */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 32, "local.get", ""],
    [26 /* LocalSet */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 33, "local.set", ""],
    [27 /* LocalTee */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 34, "local.tee", ""],
    [28 /* GlobalGet */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 35, "global.get", ""],
    [29 /* GlobalSet */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 36, "global.set", ""],
    [30 /* I32Load */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 0, 40, "i32.load", ""],
    [31 /* I64Load */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 0, 41, "i64.load", ""],
    [32 /* F32Load */]: [2 /* F32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 0, 42, "f32.load", ""],
    [33 /* F64Load */]: [3 /* F64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 0, 43, "f64.load", ""],
    [34 /* I32Load8S */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 1, 0, 44, "i32.load8_s", ""],
    [35 /* I32Load8U */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 1, 0, 45, "i32.load8_u", ""],
    [36 /* I32Load16S */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 2, 0, 46, "i32.load16_s", ""],
    [37 /* I32Load16U */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 2, 0, 47, "i32.load16_u", ""],
    [38 /* I64Load8S */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 1, 0, 48, "i64.load8_s", ""],
    [39 /* I64Load8U */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 1, 0, 49, "i64.load8_u", ""],
    [40 /* I64Load16S */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 2, 0, 50, "i64.load16_s", ""],
    [41 /* I64Load16U */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 2, 0, 51, "i64.load16_u", ""],
    [42 /* I64Load32S */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 0, 52, "i64.load32_s", ""],
    [43 /* I64Load32U */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 0, 53, "i64.load32_u", ""],
    [44 /* I32Store */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 0, 54, "i32.store", ""],
    [45 /* I64Store */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 0, 55, "i64.store", ""],
    [46 /* F32Store */]: [14 /* ___ */, 0 /* I32 */, 2 /* F32 */, 14 /* ___ */, 4, 0, 56, "f32.store", ""],
    [47 /* F64Store */]: [14 /* ___ */, 0 /* I32 */, 3 /* F64 */, 14 /* ___ */, 8, 0, 57, "f64.store", ""],
    [48 /* I32Store8 */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 0, 58, "i32.store8", ""],
    [49 /* I32Store16 */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 0, 59, "i32.store16", ""],
    [50 /* I64Store8 */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 0, 60, "i64.store8", ""],
    [51 /* I64Store16 */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 0, 61, "i64.store16", ""],
    [52 /* I64Store32 */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 0, 62, "i64.store32", ""],
    [53 /* MemorySize */]: [0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 63, "memory.size", ""],
    [54 /* MemoryGrow */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 64, "memory.grow", ""],
    [55 /* I32Const */]: [0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 65, "i32.const", ""],
    [56 /* I64Const */]: [1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 66, "i64.const", ""],
    [57 /* F32Const */]: [2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 67, "f32.const", ""],
    [58 /* F64Const */]: [3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 68, "f64.const", ""],
    [59 /* I32Eqz */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 69, "i32.eqz", "eqz"],
    [60 /* I32Eq */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 70, "i32.eq", "=="],
    [61 /* I32Ne */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 71, "i32.ne", "!="],
    [62 /* I32LtS */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 72, "i32.lt_s", "<"],
    [63 /* I32LtU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 73, "i32.lt_u", "<"],
    [64 /* I32GtS */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 74, "i32.gt_s", ">"],
    [65 /* I32GtU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 75, "i32.gt_u", ">"],
    [66 /* I32LeS */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 76, "i32.le_s", "<="],
    [67 /* I32LeU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 77, "i32.le_u", "<="],
    [68 /* I32GeS */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 78, "i32.ge_s", ">="],
    [69 /* I32GeU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 79, "i32.ge_u", ">="],
    [70 /* I64Eqz */]: [0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 80, "i64.eqz", "eqz"],
    [71 /* I64Eq */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 81, "i64.eq", "=="],
    [72 /* I64Ne */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 82, "i64.ne", "!="],
    [73 /* I64LtS */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 83, "i64.lt_s", "<"],
    [74 /* I64LtU */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 84, "i64.lt_u", "<"],
    [75 /* I64GtS */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 85, "i64.gt_s", ">"],
    [76 /* I64GtU */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 86, "i64.gt_u", ">"],
    [77 /* I64LeS */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 87, "i64.le_s", "<="],
    [78 /* I64LeU */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 88, "i64.le_u", "<="],
    [79 /* I64GeS */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 89, "i64.ge_s", ">="],
    [80 /* I64GeU */]: [0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 90, "i64.ge_u", ">="],
    [81 /* F32Eq */]: [0 /* I32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 91, "f32.eq", "=="],
    [82 /* F32Ne */]: [0 /* I32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 92, "f32.ne", "!="],
    [83 /* F32Lt */]: [0 /* I32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 93, "f32.lt", "<"],
    [84 /* F32Gt */]: [0 /* I32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 94, "f32.gt", ">"],
    [85 /* F32Le */]: [0 /* I32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 95, "f32.le", "<="],
    [86 /* F32Ge */]: [0 /* I32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 96, "f32.ge", ">="],
    [87 /* F64Eq */]: [0 /* I32 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 97, "f64.eq", "=="],
    [88 /* F64Ne */]: [0 /* I32 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 98, "f64.ne", "!="],
    [89 /* F64Lt */]: [0 /* I32 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 99, "f64.lt", "<"],
    [90 /* F64Gt */]: [0 /* I32 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 100, "f64.gt", ">"],
    [91 /* F64Le */]: [0 /* I32 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 101, "f64.le", "<="],
    [92 /* F64Ge */]: [0 /* I32 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 102, "f64.ge", ">="],
    [93 /* I32Clz */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 103, "i32.clz", "clz"],
    [94 /* I32Ctz */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 104, "i32.ctz", "ctz"],
    [95 /* I32Popcnt */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 105, "i32.popcnt", "popcnt"],
    [96 /* I32Add */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 106, "i32.add", "+"],
    [97 /* I32Sub */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 107, "i32.sub", "-"],
    [98 /* I32Mul */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 108, "i32.mul", "*"],
    [99 /* I32DivS */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 109, "i32.div_s", "/"],
    [100 /* I32DivU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 110, "i32.div_u", "/"],
    [101 /* I32RemS */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 111, "i32.rem_s", "%"],
    [102 /* I32RemU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 112, "i32.rem_u", "%"],
    [103 /* I32And */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 113, "i32.and", "&"],
    [104 /* I32Or */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 114, "i32.or", "|"],
    [105 /* I32Xor */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 115, "i32.xor", "^"],
    [106 /* I32Shl */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 116, "i32.shl", "<<"],
    [107 /* I32ShrS */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 117, "i32.shr_s", ">>"],
    [108 /* I32ShrU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 118, "i32.shr_u", ">>"],
    [109 /* I32Rotl */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 119, "i32.rotl", "<<"],
    [110 /* I32Rotr */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 0, 0, 120, "i32.rotr", ">>"],
    [111 /* I64Clz */]: [1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 121, "i64.clz", "clz"],
    [112 /* I64Ctz */]: [1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 122, "i64.ctz", "ctz"],
    [113 /* I64Popcnt */]: [1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 123, "i64.popcnt", "popcnt"],
    [114 /* I64Add */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 124, "i64.add", "+"],
    [115 /* I64Sub */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 125, "i64.sub", "-"],
    [116 /* I64Mul */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 126, "i64.mul", "*"],
    [117 /* I64DivS */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 127, "i64.div_s", "/"],
    [118 /* I64DivU */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 128, "i64.div_u", "/"],
    [119 /* I64RemS */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 129, "i64.rem_s", "%"],
    [120 /* I64RemU */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 130, "i64.rem_u", "%"],
    [121 /* I64And */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 131, "i64.and", "&"],
    [122 /* I64Or */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 132, "i64.or", "|"],
    [123 /* I64Xor */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 133, "i64.xor", "^"],
    [124 /* I64Shl */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 134, "i64.shl", "<<"],
    [125 /* I64ShrS */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 135, "i64.shr_s", ">>"],
    [126 /* I64ShrU */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 136, "i64.shr_u", ">>"],
    [127 /* I64Rotl */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 137, "i64.rotl", "<<"],
    [128 /* I64Rotr */]: [1 /* I64 */, 1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 0, 0, 138, "i64.rotr", ">>"],
    [129 /* F32Abs */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 139, "f32.abs", "abs"],
    [130 /* F32Neg */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 140, "f32.neg", "-"],
    [131 /* F32Ceil */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 141, "f32.ceil", "ceil"],
    [132 /* F32Floor */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 142, "f32.floor", "floor"],
    [133 /* F32Trunc */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 143, "f32.trunc", "trunc"],
    [134 /* F32Nearest */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 144, "f32.nearest", "nearest"],
    [135 /* F32Sqrt */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 145, "f32.sqrt", "sqrt"],
    [136 /* F32Add */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 146, "f32.add", "+"],
    [137 /* F32Sub */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 147, "f32.sub", "-"],
    [138 /* F32Mul */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 148, "f32.mul", "*"],
    [139 /* F32Div */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 149, "f32.div", "/"],
    [140 /* F32Min */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 150, "f32.min", "min"],
    [141 /* F32Max */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 151, "f32.max", "max"],
    [142 /* F32Copysign */]: [2 /* F32 */, 2 /* F32 */, 2 /* F32 */, 14 /* ___ */, 0, 0, 152, "f32.copysign", "copysign"],
    [143 /* F64Abs */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 153, "f64.abs", "abs"],
    [144 /* F64Neg */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 154, "f64.neg", "-"],
    [145 /* F64Ceil */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 155, "f64.ceil", "ceil"],
    [146 /* F64Floor */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 156, "f64.floor", "floor"],
    [147 /* F64Trunc */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 157, "f64.trunc", "trunc"],
    [148 /* F64Nearest */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 158, "f64.nearest", "nearest"],
    [149 /* F64Sqrt */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 159, "f64.sqrt", "sqrt"],
    [150 /* F64Add */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 160, "f64.add", "+"],
    [151 /* F64Sub */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 161, "f64.sub", "-"],
    [152 /* F64Mul */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 162, "f64.mul", "*"],
    [153 /* F64Div */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 163, "f64.div", "/"],
    [154 /* F64Min */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 164, "f64.min", "min"],
    [155 /* F64Max */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 165, "f64.max", "max"],
    [156 /* F64Copysign */]: [3 /* F64 */, 3 /* F64 */, 3 /* F64 */, 14 /* ___ */, 0, 0, 166, "f64.copysign", "copysign"],
    [157 /* I32WrapI64 */]: [0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 167, "i32.wrap_i64", ""],
    [158 /* I32TruncF32S */]: [0 /* I32 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 168, "i32.trunc_f32_s", ""],
    [159 /* I32TruncF32U */]: [0 /* I32 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 169, "i32.trunc_f32_u", ""],
    [160 /* I32TruncF64S */]: [0 /* I32 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 170, "i32.trunc_f64_s", ""],
    [161 /* I32TruncF64U */]: [0 /* I32 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 171, "i32.trunc_f64_u", ""],
    [162 /* I64ExtendI32S */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 172, "i64.extend_i32_s", ""],
    [163 /* I64ExtendI32U */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 173, "i64.extend_i32_u", ""],
    [164 /* I64TruncF32S */]: [1 /* I64 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 174, "i64.trunc_f32_s", ""],
    [165 /* I64TruncF32U */]: [1 /* I64 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 175, "i64.trunc_f32_u", ""],
    [166 /* I64TruncF64S */]: [1 /* I64 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 176, "i64.trunc_f64_s", ""],
    [167 /* I64TruncF64U */]: [1 /* I64 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 177, "i64.trunc_f64_u", ""],
    [168 /* F32ConvertI32S */]: [2 /* F32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 178, "f32.convert_i32_s", ""],
    [169 /* F32ConvertI32U */]: [2 /* F32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 179, "f32.convert_i32_u", ""],
    [170 /* F32ConvertI64S */]: [2 /* F32 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 180, "f32.convert_i64_s", ""],
    [171 /* F32ConvertI64U */]: [2 /* F32 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 181, "f32.convert_i64_u", ""],
    [172 /* F32DemoteF64 */]: [2 /* F32 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 182, "f32.demote_f64", ""],
    [173 /* F64ConvertI32S */]: [3 /* F64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 183, "f64.convert_i32_s", ""],
    [174 /* F64ConvertI32U */]: [3 /* F64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 184, "f64.convert_i32_u", ""],
    [175 /* F64ConvertI64S */]: [3 /* F64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 185, "f64.convert_i64_s", ""],
    [176 /* F64ConvertI64U */]: [3 /* F64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 186, "f64.convert_i64_u", ""],
    [177 /* F64PromoteF32 */]: [3 /* F64 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 187, "f64.promote_f32", ""],
    [178 /* I32ReinterpretF32 */]: [0 /* I32 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 188, "i32.reinterpret_f32", ""],
    [179 /* I64ReinterpretF64 */]: [1 /* I64 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 189, "i64.reinterpret_f64", ""],
    [180 /* F32ReinterpretI32 */]: [2 /* F32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 190, "f32.reinterpret_i32", ""],
    [181 /* F64ReinterpretI64 */]: [3 /* F64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 191, "f64.reinterpret_i64", ""],
    [182 /* I32Extend8S */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 192, "i32.extend8_s", ""],
    [183 /* I32Extend16S */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 193, "i32.extend16_s", ""],
    [184 /* I64Extend8S */]: [1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 194, "i64.extend8_s", ""],
    [185 /* I64Extend16S */]: [1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 195, "i64.extend16_s", ""],
    [186 /* I64Extend32S */]: [1 /* I64 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 196, "i64.extend32_s", ""],
    [187 /* InterpAlloca */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 224, "alloca", ""],
    [188 /* InterpBrUnless */]: [14 /* ___ */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 225, "br_unless", ""],
    [189 /* InterpCallImport */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 226, "call_import", ""],
    [190 /* InterpData */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 227, "data", ""],
    [191 /* InterpDropKeep */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 228, "drop_keep", ""],
    [192 /* InterpCatchDrop */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 229, "catch_drop", ""],
    [193 /* InterpAdjustFrameForReturnCall */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 230, "adjust_frame_for_return_call", ""],
    [194 /* I32TruncSatF32S */]: [0 /* I32 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 0, "i32.trunc_sat_f32_s", ""],
    [195 /* I32TruncSatF32U */]: [0 /* I32 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 1, "i32.trunc_sat_f32_u", ""],
    [196 /* I32TruncSatF64S */]: [0 /* I32 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 2, "i32.trunc_sat_f64_s", ""],
    [197 /* I32TruncSatF64U */]: [0 /* I32 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 3, "i32.trunc_sat_f64_u", ""],
    [198 /* I64TruncSatF32S */]: [1 /* I64 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 4, "i64.trunc_sat_f32_s", ""],
    [199 /* I64TruncSatF32U */]: [1 /* I64 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 5, "i64.trunc_sat_f32_u", ""],
    [200 /* I64TruncSatF64S */]: [1 /* I64 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 6, "i64.trunc_sat_f64_s", ""],
    [201 /* I64TruncSatF64U */]: [1 /* I64 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 252, 7, "i64.trunc_sat_f64_u", ""],
    [202 /* MemoryInit */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0, 252, 8, "memory.init", ""],
    [203 /* DataDrop */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 252, 9, "data.drop", ""],
    [204 /* MemoryCopy */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0, 252, 10, "memory.copy", ""],
    [205 /* MemoryFill */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0, 252, 11, "memory.fill", ""],
    [206 /* TableInit */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0, 252, 12, "table.init", ""],
    [207 /* ElemDrop */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 252, 13, "elem.drop", ""],
    [208 /* TableCopy */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0, 252, 14, "table.copy", ""],
    [209 /* TableGet */]: [14 /* ___ */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 37, "table.get", ""],
    [210 /* TableSet */]: [14 /* ___ */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 0, 38, "table.set", ""],
    [211 /* TableGrow */]: [14 /* ___ */, 14 /* ___ */, 0 /* I32 */, 14 /* ___ */, 0, 252, 15, "table.grow", ""],
    [212 /* TableSize */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 252, 16, "table.size", ""],
    [213 /* TableFill */]: [14 /* ___ */, 0 /* I32 */, 14 /* ___ */, 0 /* I32 */, 0, 252, 17, "table.fill", ""],
    [214 /* RefNull */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 208, "ref.null", ""],
    [215 /* RefIsNull */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 209, "ref.is_null", ""],
    [216 /* RefFunc */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 210, "ref.func", ""],
    [217 /* V128Load */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 16, 253, 0, "v128.load", ""],
    [218 /* V128Load8X8S */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 1, "v128.load8x8_s", ""],
    [219 /* V128Load8X8U */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 2, "v128.load8x8_u", ""],
    [220 /* V128Load16X4S */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 3, "v128.load16x4_s", ""],
    [221 /* V128Load16X4U */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 4, "v128.load16x4_u", ""],
    [222 /* V128Load32X2S */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 5, "v128.load32x2_s", ""],
    [223 /* V128Load32X2U */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 6, "v128.load32x2_u", ""],
    [224 /* V128Load8Splat */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 1, 253, 7, "v128.load8_splat", ""],
    [225 /* V128Load16Splat */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 2, 253, 8, "v128.load16_splat", ""],
    [226 /* V128Load32Splat */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 253, 9, "v128.load32_splat", ""],
    [227 /* V128Load64Splat */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 10, "v128.load64_splat", ""],
    [228 /* V128Store */]: [14 /* ___ */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 16, 253, 11, "v128.store", ""],
    [229 /* V128Const */]: [4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 253, 12, "v128.const", ""],
    [230 /* I8X16Shuffle */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 13, "i8x16.shuffle", ""],
    [231 /* I8X16Swizzle */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 14, "i8x16.swizzle", ""],
    [232 /* I8X16Splat */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 15, "i8x16.splat", ""],
    [233 /* I16X8Splat */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 16, "i16x8.splat", ""],
    [234 /* I32X4Splat */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 17, "i32x4.splat", ""],
    [235 /* I64X2Splat */]: [4 /* V128 */, 1 /* I64 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 18, "i64x2.splat", ""],
    [236 /* F32X4Splat */]: [4 /* V128 */, 2 /* F32 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 19, "f32x4.splat", ""],
    [237 /* F64X2Splat */]: [4 /* V128 */, 3 /* F64 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 20, "f64x2.splat", ""],
    [238 /* I8X16ExtractLaneS */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 21, "i8x16.extract_lane_s", ""],
    [239 /* I8X16ExtractLaneU */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 22, "i8x16.extract_lane_u", ""],
    [240 /* I8X16ReplaceLane */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 23, "i8x16.replace_lane", ""],
    [241 /* I16X8ExtractLaneS */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 24, "i16x8.extract_lane_s", ""],
    [242 /* I16X8ExtractLaneU */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 25, "i16x8.extract_lane_u", ""],
    [243 /* I16X8ReplaceLane */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 26, "i16x8.replace_lane", ""],
    [244 /* I32X4ExtractLane */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 27, "i32x4.extract_lane", ""],
    [245 /* I32X4ReplaceLane */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 28, "i32x4.replace_lane", ""],
    [246 /* I64X2ExtractLane */]: [1 /* I64 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 29, "i64x2.extract_lane", ""],
    [247 /* I64X2ReplaceLane */]: [4 /* V128 */, 4 /* V128 */, 1 /* I64 */, 14 /* ___ */, 0, 253, 30, "i64x2.replace_lane", ""],
    [248 /* F32X4ExtractLane */]: [2 /* F32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 31, "f32x4.extract_lane", ""],
    [249 /* F32X4ReplaceLane */]: [4 /* V128 */, 4 /* V128 */, 2 /* F32 */, 14 /* ___ */, 0, 253, 32, "f32x4.replace_lane", ""],
    [250 /* F64X2ExtractLane */]: [3 /* F64 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 33, "f64x2.extract_lane", ""],
    [251 /* F64X2ReplaceLane */]: [4 /* V128 */, 4 /* V128 */, 3 /* F64 */, 14 /* ___ */, 0, 253, 34, "f64x2.replace_lane", ""],
    [252 /* I8X16Eq */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 35, "i8x16.eq", ""],
    [253 /* I8X16Ne */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 36, "i8x16.ne", ""],
    [254 /* I8X16LtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 37, "i8x16.lt_s", ""],
    [255 /* I8X16LtU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 38, "i8x16.lt_u", ""],
    [256 /* I8X16GtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 39, "i8x16.gt_s", ""],
    [257 /* I8X16GtU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 40, "i8x16.gt_u", ""],
    [258 /* I8X16LeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 41, "i8x16.le_s", ""],
    [259 /* I8X16LeU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 42, "i8x16.le_u", ""],
    [260 /* I8X16GeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 43, "i8x16.ge_s", ""],
    [261 /* I8X16GeU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 44, "i8x16.ge_u", ""],
    [262 /* I16X8Eq */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 45, "i16x8.eq", ""],
    [263 /* I16X8Ne */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 46, "i16x8.ne", ""],
    [264 /* I16X8LtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 47, "i16x8.lt_s", ""],
    [265 /* I16X8LtU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 48, "i16x8.lt_u", ""],
    [266 /* I16X8GtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 49, "i16x8.gt_s", ""],
    [267 /* I16X8GtU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 50, "i16x8.gt_u", ""],
    [268 /* I16X8LeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 51, "i16x8.le_s", ""],
    [269 /* I16X8LeU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 52, "i16x8.le_u", ""],
    [270 /* I16X8GeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 53, "i16x8.ge_s", ""],
    [271 /* I16X8GeU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 54, "i16x8.ge_u", ""],
    [272 /* I32X4Eq */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 55, "i32x4.eq", ""],
    [273 /* I32X4Ne */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 56, "i32x4.ne", ""],
    [274 /* I32X4LtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 57, "i32x4.lt_s", ""],
    [275 /* I32X4LtU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 58, "i32x4.lt_u", ""],
    [276 /* I32X4GtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 59, "i32x4.gt_s", ""],
    [277 /* I32X4GtU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 60, "i32x4.gt_u", ""],
    [278 /* I32X4LeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 61, "i32x4.le_s", ""],
    [279 /* I32X4LeU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 62, "i32x4.le_u", ""],
    [280 /* I32X4GeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 63, "i32x4.ge_s", ""],
    [281 /* I32X4GeU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 64, "i32x4.ge_u", ""],
    [282 /* F32X4Eq */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 65, "f32x4.eq", ""],
    [283 /* F32X4Ne */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 66, "f32x4.ne", ""],
    [284 /* F32X4Lt */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 67, "f32x4.lt", ""],
    [285 /* F32X4Gt */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 68, "f32x4.gt", ""],
    [286 /* F32X4Le */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 69, "f32x4.le", ""],
    [287 /* F32X4Ge */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 70, "f32x4.ge", ""],
    [288 /* F64X2Eq */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 71, "f64x2.eq", ""],
    [289 /* F64X2Ne */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 72, "f64x2.ne", ""],
    [290 /* F64X2Lt */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 73, "f64x2.lt", ""],
    [291 /* F64X2Gt */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 74, "f64x2.gt", ""],
    [292 /* F64X2Le */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 75, "f64x2.le", ""],
    [293 /* F64X2Ge */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 76, "f64x2.ge", ""],
    [294 /* V128Not */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 77, "v128.not", ""],
    [295 /* V128And */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 78, "v128.and", ""],
    [296 /* V128Andnot */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 79, "v128.andnot", ""],
    [297 /* V128Or */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 80, "v128.or", ""],
    [298 /* V128Xor */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 81, "v128.xor", ""],
    [299 /* V128BitSelect */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 82, "v128.bitselect", ""],
    [300 /* V128AnyTrue */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 83, "v128.any_true", ""],
    [301 /* V128Load8Lane */]: [4 /* V128 */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 1, 253, 84, "v128.load8_lane", ""],
    [302 /* V128Load16Lane */]: [4 /* V128 */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 2, 253, 85, "v128.load16_lane", ""],
    [303 /* V128Load32Lane */]: [4 /* V128 */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 4, 253, 86, "v128.load32_lane", ""],
    [304 /* V128Load64Lane */]: [4 /* V128 */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 8, 253, 87, "v128.load64_lane", ""],
    [305 /* V128Store8Lane */]: [14 /* ___ */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 1, 253, 88, "v128.store8_lane", ""],
    [306 /* V128Store16Lane */]: [14 /* ___ */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 2, 253, 89, "v128.store16_lane", ""],
    [307 /* V128Store32Lane */]: [14 /* ___ */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 4, 253, 90, "v128.store32_lane", ""],
    [308 /* V128Store64Lane */]: [14 /* ___ */, 0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 8, 253, 91, "v128.store64_lane", ""],
    [309 /* V128Load32Zero */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 253, 92, "v128.load32_zero", ""],
    [310 /* V128Load64Zero */]: [4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 253, 93, "v128.load64_zero", ""],
    [311 /* F32X4DemoteF64X2Zero */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 94, "f32x4.demote_f64x2_zero", ""],
    [312 /* F64X2PromoteLowF32X4 */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 95, "f64x2.promote_low_f32x4", ""],
    [313 /* I8X16Abs */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 96, "i8x16.abs", ""],
    [314 /* I8X16Neg */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 97, "i8x16.neg", ""],
    [315 /* I8X16Popcnt */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 98, "i8x16.popcnt", ""],
    [316 /* I8X16AllTrue */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 99, "i8x16.all_true", ""],
    [317 /* I8X16Bitmask */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 100, "i8x16.bitmask", ""],
    [318 /* I8X16NarrowI16X8S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 101, "i8x16.narrow_i16x8_s", ""],
    [319 /* I8X16NarrowI16X8U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 102, "i8x16.narrow_i16x8_u", ""],
    [320 /* I8X16Shl */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 107, "i8x16.shl", ""],
    [321 /* I8X16ShrS */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 108, "i8x16.shr_s", ""],
    [322 /* I8X16ShrU */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 109, "i8x16.shr_u", ""],
    [323 /* I8X16Add */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 110, "i8x16.add", ""],
    [324 /* I8X16AddSatS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 111, "i8x16.add_sat_s", ""],
    [325 /* I8X16AddSatU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 112, "i8x16.add_sat_u", ""],
    [326 /* I8X16Sub */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 113, "i8x16.sub", ""],
    [327 /* I8X16SubSatS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 114, "i8x16.sub_sat_s", ""],
    [328 /* I8X16SubSatU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 115, "i8x16.sub_sat_u", ""],
    [329 /* I8X16MinS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 118, "i8x16.min_s", ""],
    [330 /* I8X16MinU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 119, "i8x16.min_u", ""],
    [331 /* I8X16MaxS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 120, "i8x16.max_s", ""],
    [332 /* I8X16MaxU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 121, "i8x16.max_u", ""],
    [333 /* I8X16AvgrU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 123, "i8x16.avgr_u", ""],
    [334 /* I16X8ExtaddPairwiseI8X16S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 124, "i16x8.extadd_pairwise_i8x16_s", ""],
    [335 /* I16X8ExtaddPairwiseI8X16U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 125, "i16x8.extadd_pairwise_i8x16_u", ""],
    [336 /* I32X4ExtaddPairwiseI16X8S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 126, "i32x4.extadd_pairwise_i16x8_s", ""],
    [337 /* I32X4ExtaddPairwiseI16X8U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 127, "i32x4.extadd_pairwise_i16x8_u", ""],
    [338 /* I16X8Abs */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 128, "i16x8.abs", ""],
    [339 /* I16X8Neg */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 129, "i16x8.neg", ""],
    [340 /* I16X8Q15mulrSatS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 130, "i16x8.q15mulr_sat_s", ""],
    [341 /* I16X8AllTrue */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 131, "i16x8.all_true", ""],
    [342 /* I16X8Bitmask */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 132, "i16x8.bitmask", ""],
    [343 /* I16X8NarrowI32X4S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 133, "i16x8.narrow_i32x4_s", ""],
    [344 /* I16X8NarrowI32X4U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 134, "i16x8.narrow_i32x4_u", ""],
    [345 /* I16X8ExtendLowI8X16S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 135, "i16x8.extend_low_i8x16_s", ""],
    [346 /* I16X8ExtendHighI8X16S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 136, "i16x8.extend_high_i8x16_s", ""],
    [347 /* I16X8ExtendLowI8X16U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 137, "i16x8.extend_low_i8x16_u", ""],
    [348 /* I16X8ExtendHighI8X16U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 138, "i16x8.extend_high_i8x16_u", ""],
    [349 /* I16X8Shl */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 139, "i16x8.shl", ""],
    [350 /* I16X8ShrS */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 140, "i16x8.shr_s", ""],
    [351 /* I16X8ShrU */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 141, "i16x8.shr_u", ""],
    [352 /* I16X8Add */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 142, "i16x8.add", ""],
    [353 /* I16X8AddSatS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 143, "i16x8.add_sat_s", ""],
    [354 /* I16X8AddSatU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 144, "i16x8.add_sat_u", ""],
    [355 /* I16X8Sub */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 145, "i16x8.sub", ""],
    [356 /* I16X8SubSatS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 146, "i16x8.sub_sat_s", ""],
    [357 /* I16X8SubSatU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 147, "i16x8.sub_sat_u", ""],
    [358 /* I16X8Mul */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 149, "i16x8.mul", ""],
    [359 /* I16X8MinS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 150, "i16x8.min_s", ""],
    [360 /* I16X8MinU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 151, "i16x8.min_u", ""],
    [361 /* I16X8MaxS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 152, "i16x8.max_s", ""],
    [362 /* I16X8MaxU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 153, "i16x8.max_u", ""],
    [363 /* I16X8AvgrU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 155, "i16x8.avgr_u", ""],
    [364 /* I16X8ExtmulLowI8X16S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 156, "i16x8.extmul_low_i8x16_s", ""],
    [365 /* I16X8ExtmulHighI8X16S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 157, "i16x8.extmul_high_i8x16_s", ""],
    [366 /* I16X8ExtmulLowI8X16U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 158, "i16x8.extmul_low_i8x16_u", ""],
    [367 /* I16X8ExtmulHighI8X16U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 159, "i16x8.extmul_high_i8x16_u", ""],
    [368 /* I32X4Abs */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 160, "i32x4.abs", ""],
    [369 /* I32X4Neg */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 161, "i32x4.neg", ""],
    [370 /* I32X4AllTrue */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 163, "i32x4.all_true", ""],
    [371 /* I32X4Bitmask */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 164, "i32x4.bitmask", ""],
    [372 /* I32X4ExtendLowI16X8S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 167, "i32x4.extend_low_i16x8_s", ""],
    [373 /* I32X4ExtendHighI16X8S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 168, "i32x4.extend_high_i16x8_s", ""],
    [374 /* I32X4ExtendLowI16X8U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 169, "i32x4.extend_low_i16x8_u", ""],
    [375 /* I32X4ExtendHighI16X8U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 170, "i32x4.extend_high_i16x8_u", ""],
    [376 /* I32X4Shl */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 171, "i32x4.shl", ""],
    [377 /* I32X4ShrS */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 172, "i32x4.shr_s", ""],
    [378 /* I32X4ShrU */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 173, "i32x4.shr_u", ""],
    [379 /* I32X4Add */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 174, "i32x4.add", ""],
    [380 /* I32X4Sub */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 177, "i32x4.sub", ""],
    [381 /* I32X4Mul */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 181, "i32x4.mul", ""],
    [382 /* I32X4MinS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 182, "i32x4.min_s", ""],
    [383 /* I32X4MinU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 183, "i32x4.min_u", ""],
    [384 /* I32X4MaxS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 184, "i32x4.max_s", ""],
    [385 /* I32X4MaxU */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 185, "i32x4.max_u", ""],
    [386 /* I32X4DotI16X8S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 186, "i32x4.dot_i16x8_s", ""],
    [387 /* I32X4ExtmulLowI16X8S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 188, "i32x4.extmul_low_i16x8_s", ""],
    [388 /* I32X4ExtmulHighI16X8S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 189, "i32x4.extmul_high_i16x8_s", ""],
    [389 /* I32X4ExtmulLowI16X8U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 190, "i32x4.extmul_low_i16x8_u", ""],
    [390 /* I32X4ExtmulHighI16X8U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 191, "i32x4.extmul_high_i16x8_u", ""],
    [391 /* I64X2Abs */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 192, "i64x2.abs", ""],
    [392 /* I64X2Neg */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 193, "i64x2.neg", ""],
    [393 /* I64X2AllTrue */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 195, "i64x2.all_true", ""],
    [394 /* I64X2Bitmask */]: [0 /* I32 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 196, "i64x2.bitmask", ""],
    [395 /* I64X2ExtendLowI32X4S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 199, "i64x2.extend_low_i32x4_s", ""],
    [396 /* I64X2ExtendHighI32X4S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 200, "i64x2.extend_high_i32x4_s", ""],
    [397 /* I64X2ExtendLowI32X4U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 201, "i64x2.extend_low_i32x4_u", ""],
    [398 /* I64X2ExtendHighI32X4U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 202, "i64x2.extend_high_i32x4_u", ""],
    [399 /* I64X2Shl */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 203, "i64x2.shl", ""],
    [400 /* I64X2ShrS */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 204, "i64x2.shr_s", ""],
    [401 /* I64X2ShrU */]: [4 /* V128 */, 4 /* V128 */, 0 /* I32 */, 14 /* ___ */, 0, 253, 205, "i64x2.shr_u", ""],
    [402 /* I64X2Add */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 206, "i64x2.add", ""],
    [403 /* I64X2Sub */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 209, "i64x2.sub", ""],
    [404 /* I64X2Mul */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 213, "i64x2.mul", ""],
    [405 /* I64X2Eq */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 214, "i64x2.eq", ""],
    [406 /* I64X2Ne */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 215, "i64x2.ne", ""],
    [407 /* I64X2LtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 216, "i64x2.lt_s", ""],
    [408 /* I64X2GtS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 217, "i64x2.gt_s", ""],
    [409 /* I64X2LeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 218, "i64x2.le_s", ""],
    [410 /* I64X2GeS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 219, "i64x2.ge_s", ""],
    [411 /* I64X2ExtmulLowI32X4S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 220, "i64x2.extmul_low_i32x4_s", ""],
    [412 /* I64X2ExtmulHighI32X4S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 221, "i64x2.extmul_high_i32x4_s", ""],
    [413 /* I64X2ExtmulLowI32X4U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 222, "i64x2.extmul_low_i32x4_u", ""],
    [414 /* I64X2ExtmulHighI32X4U */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 223, "i64x2.extmul_high_i32x4_u", ""],
    [415 /* F32X4Ceil */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 103, "f32x4.ceil", ""],
    [416 /* F32X4Floor */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 104, "f32x4.floor", ""],
    [417 /* F32X4Trunc */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 105, "f32x4.trunc", ""],
    [418 /* F32X4Nearest */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 106, "f32x4.nearest", ""],
    [419 /* F64X2Ceil */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 116, "f64x2.ceil", ""],
    [420 /* F64X2Floor */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 117, "f64x2.floor", ""],
    [421 /* F64X2Trunc */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 122, "f64x2.trunc", ""],
    [422 /* F64X2Nearest */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 148, "f64x2.nearest", ""],
    [423 /* F32X4Abs */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 224, "f32x4.abs", ""],
    [424 /* F32X4Neg */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 225, "f32x4.neg", ""],
    [425 /* F32X4Sqrt */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 227, "f32x4.sqrt", ""],
    [426 /* F32X4Add */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 228, "f32x4.add", ""],
    [427 /* F32X4Sub */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 229, "f32x4.sub", ""],
    [428 /* F32X4Mul */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 230, "f32x4.mul", ""],
    [429 /* F32X4Div */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 231, "f32x4.div", ""],
    [430 /* F32X4Min */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 232, "f32x4.min", ""],
    [431 /* F32X4Max */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 233, "f32x4.max", ""],
    [432 /* F32X4PMin */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 234, "f32x4.pmin", ""],
    [433 /* F32X4PMax */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 235, "f32x4.pmax", ""],
    [434 /* F64X2Abs */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 236, "f64x2.abs", ""],
    [435 /* F64X2Neg */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 237, "f64x2.neg", ""],
    [436 /* F64X2Sqrt */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 239, "f64x2.sqrt", ""],
    [437 /* F64X2Add */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 240, "f64x2.add", ""],
    [438 /* F64X2Sub */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 241, "f64x2.sub", ""],
    [439 /* F64X2Mul */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 242, "f64x2.mul", ""],
    [440 /* F64X2Div */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 243, "f64x2.div", ""],
    [441 /* F64X2Min */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 244, "f64x2.min", ""],
    [442 /* F64X2Max */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 245, "f64x2.max", ""],
    [443 /* F64X2PMin */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 246, "f64x2.pmin", ""],
    [444 /* F64X2PMax */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 247, "f64x2.pmax", ""],
    [445 /* I32X4TruncSatF32X4S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 248, "i32x4.trunc_sat_f32x4_s", ""],
    [446 /* I32X4TruncSatF32X4U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 249, "i32x4.trunc_sat_f32x4_u", ""],
    [447 /* F32X4ConvertI32X4S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 250, "f32x4.convert_i32x4_s", ""],
    [448 /* F32X4ConvertI32X4U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 251, "f32x4.convert_i32x4_u", ""],
    [449 /* I32X4TruncSatF64X2SZero */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 252, "i32x4.trunc_sat_f64x2_s_zero", ""],
    [450 /* I32X4TruncSatF64X2UZero */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 253, "i32x4.trunc_sat_f64x2_u_zero", ""],
    [451 /* F64X2ConvertLowI32X4S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 254, "f64x2.convert_low_i32x4_s", ""],
    [452 /* F64X2ConvertLowI32X4U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 255, "f64x2.convert_low_i32x4_u", ""],
    [453 /* I8X16RelaxedSwizzle */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 256, "i8x16.relaxed_swizzle", ""],
    [454 /* I32X4RelaxedTruncF32X4S */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 257, "i32x4.relaxed_trunc_f32x4_s", ""],
    [455 /* I32X4RelaxedTruncF32X4U */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 258, "i32x4.relaxed_trunc_f32x4_u", ""],
    [456 /* I32X4RelaxedTruncF64X2SZero */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 259, "i32x4.relaxed_trunc_f64x2_s_zero", ""],
    [457 /* I32X4RelaxedTruncF64X2UZero */]: [4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 14 /* ___ */, 0, 253, 260, "i32x4.relaxed_trunc_f64x2_u_zero", ""],
    [458 /* F32X4RelaxedMadd */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 261, "f32x4.relaxed_madd", ""],
    [459 /* F32X4RelaxedNmadd */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 262, "f32x4.relaxed_nmadd", ""],
    [460 /* F64X2RelaxedMadd */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 263, "f64x2.relaxed_madd", ""],
    [461 /* F64X2RelaxedNmadd */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 264, "f64x2.relaxed_nmadd", ""],
    [462 /* I8X16RelaxedLaneSelect */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 265, "i8x16.relaxed_laneselect", ""],
    [463 /* I16X8RelaxedLaneSelect */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 266, "i16x8.relaxed_laneselect", ""],
    [464 /* I32X4RelaxedLaneSelect */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 267, "i32x4.relaxed_laneselect", ""],
    [465 /* I64X2RelaxedLaneSelect */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 268, "i64x2.relaxed_laneselect", ""],
    [466 /* F32X4RelaxedMin */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 269, "f32x4.relaxed_min", ""],
    [467 /* F32X4RelaxedMax */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 270, "f32x4.relaxed_max", ""],
    [468 /* F64X2RelaxedMin */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 271, "f64x2.relaxed_min", ""],
    [469 /* F64X2RelaxedMax */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 272, "f64x2.relaxed_max", ""],
    [470 /* I16X8RelaxedQ15mulrS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 273, "i16x8.relaxed_q15mulr_s", ""],
    [471 /* I16X8DotI8X16I7X16S */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 14 /* ___ */, 0, 253, 274, "i16x8.dot_i8x16_i7x16_s", ""],
    [472 /* I32X4DotI8X16I7X16AddS */]: [4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 4 /* V128 */, 0, 253, 275, "i32x4.dot_i8x16_i7x16_add_s", ""],
    [473 /* MemoryAtomicNotify */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 0, "memory.atomic.notify", ""],
    [474 /* MemoryAtomicWait32 */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 1 /* I64 */, 4, 254, 1, "memory.atomic.wait32", ""],
    [475 /* MemoryAtomicWait64 */]: [0 /* I32 */, 0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 8, 254, 2, "memory.atomic.wait64", ""],
    [476 /* AtomicFence */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 254, 3, "atomic.fence", ""],
    [477 /* I32AtomicLoad */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 254, 16, "i32.atomic.load", ""],
    [478 /* I64AtomicLoad */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 8, 254, 17, "i64.atomic.load", ""],
    [479 /* I32AtomicLoad8U */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 1, 254, 18, "i32.atomic.load8_u", ""],
    [480 /* I32AtomicLoad16U */]: [0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 2, 254, 19, "i32.atomic.load16_u", ""],
    [481 /* I64AtomicLoad8U */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 1, 254, 20, "i64.atomic.load8_u", ""],
    [482 /* I64AtomicLoad16U */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 2, 254, 21, "i64.atomic.load16_u", ""],
    [483 /* I64AtomicLoad32U */]: [1 /* I64 */, 0 /* I32 */, 14 /* ___ */, 14 /* ___ */, 4, 254, 22, "i64.atomic.load32_u", ""],
    [484 /* I32AtomicStore */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 23, "i32.atomic.store", ""],
    [485 /* I64AtomicStore */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 254, 24, "i64.atomic.store", ""],
    [486 /* I32AtomicStore8 */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 254, 25, "i32.atomic.store8", ""],
    [487 /* I32AtomicStore16 */]: [14 /* ___ */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 254, 26, "i32.atomic.store16", ""],
    [488 /* I64AtomicStore8 */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 254, 27, "i64.atomic.store8", ""],
    [489 /* I64AtomicStore16 */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 254, 28, "i64.atomic.store16", ""],
    [490 /* I64AtomicStore32 */]: [14 /* ___ */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 254, 29, "i64.atomic.store32", ""],
    [491 /* I32AtomicRmwAdd */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 30, "i32.atomic.rmw.add", ""],
    [492 /* I64AtomicRmwAdd */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 254, 31, "i64.atomic.rmw.add", ""],
    [493 /* I32AtomicRmw8AddU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 254, 32, "i32.atomic.rmw8.add_u", ""],
    [494 /* I32AtomicRmw16AddU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 254, 33, "i32.atomic.rmw16.add_u", ""],
    [495 /* I64AtomicRmw8AddU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 254, 34, "i64.atomic.rmw8.add_u", ""],
    [496 /* I64AtomicRmw16AddU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 254, 35, "i64.atomic.rmw16.add_u", ""],
    [497 /* I64AtomicRmw32AddU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 254, 36, "i64.atomic.rmw32.add_u", ""],
    [498 /* I32AtomicRmwSub */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 37, "i32.atomic.rmw.sub", ""],
    [499 /* I64AtomicRmwSub */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 254, 38, "i64.atomic.rmw.sub", ""],
    [500 /* I32AtomicRmw8SubU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 254, 39, "i32.atomic.rmw8.sub_u", ""],
    [501 /* I32AtomicRmw16SubU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 254, 40, "i32.atomic.rmw16.sub_u", ""],
    [502 /* I64AtomicRmw8SubU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 254, 41, "i64.atomic.rmw8.sub_u", ""],
    [503 /* I64AtomicRmw16SubU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 254, 42, "i64.atomic.rmw16.sub_u", ""],
    [504 /* I64AtomicRmw32SubU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 254, 43, "i64.atomic.rmw32.sub_u", ""],
    [505 /* I32AtomicRmwAnd */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 44, "i32.atomic.rmw.and", ""],
    [506 /* I64AtomicRmwAnd */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 254, 45, "i64.atomic.rmw.and", ""],
    [507 /* I32AtomicRmw8AndU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 254, 46, "i32.atomic.rmw8.and_u", ""],
    [508 /* I32AtomicRmw16AndU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 254, 47, "i32.atomic.rmw16.and_u", ""],
    [509 /* I64AtomicRmw8AndU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 254, 48, "i64.atomic.rmw8.and_u", ""],
    [510 /* I64AtomicRmw16AndU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 254, 49, "i64.atomic.rmw16.and_u", ""],
    [511 /* I64AtomicRmw32AndU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 254, 50, "i64.atomic.rmw32.and_u", ""],
    [512 /* I32AtomicRmwOr */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 51, "i32.atomic.rmw.or", ""],
    [513 /* I64AtomicRmwOr */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 254, 52, "i64.atomic.rmw.or", ""],
    [514 /* I32AtomicRmw8OrU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 254, 53, "i32.atomic.rmw8.or_u", ""],
    [515 /* I32AtomicRmw16OrU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 254, 54, "i32.atomic.rmw16.or_u", ""],
    [516 /* I64AtomicRmw8OrU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 254, 55, "i64.atomic.rmw8.or_u", ""],
    [517 /* I64AtomicRmw16OrU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 254, 56, "i64.atomic.rmw16.or_u", ""],
    [518 /* I64AtomicRmw32OrU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 254, 57, "i64.atomic.rmw32.or_u", ""],
    [519 /* I32AtomicRmwXor */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 58, "i32.atomic.rmw.xor", ""],
    [520 /* I64AtomicRmwXor */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 254, 59, "i64.atomic.rmw.xor", ""],
    [521 /* I32AtomicRmw8XorU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 254, 60, "i32.atomic.rmw8.xor_u", ""],
    [522 /* I32AtomicRmw16XorU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 254, 61, "i32.atomic.rmw16.xor_u", ""],
    [523 /* I64AtomicRmw8XorU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 254, 62, "i64.atomic.rmw8.xor_u", ""],
    [524 /* I64AtomicRmw16XorU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 254, 63, "i64.atomic.rmw16.xor_u", ""],
    [525 /* I64AtomicRmw32XorU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 254, 64, "i64.atomic.rmw32.xor_u", ""],
    [526 /* I32AtomicRmwXchg */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 4, 254, 65, "i32.atomic.rmw.xchg", ""],
    [527 /* I64AtomicRmwXchg */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 8, 254, 66, "i64.atomic.rmw.xchg", ""],
    [528 /* I32AtomicRmw8XchgU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 1, 254, 67, "i32.atomic.rmw8.xchg_u", ""],
    [529 /* I32AtomicRmw16XchgU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 14 /* ___ */, 2, 254, 68, "i32.atomic.rmw16.xchg_u", ""],
    [530 /* I64AtomicRmw8XchgU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 1, 254, 69, "i64.atomic.rmw8.xchg_u", ""],
    [531 /* I64AtomicRmw16XchgU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 2, 254, 70, "i64.atomic.rmw16.xchg_u", ""],
    [532 /* I64AtomicRmw32XchgU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 14 /* ___ */, 4, 254, 71, "i64.atomic.rmw32.xchg_u", ""],
    [533 /* I32AtomicRmwCmpxchg */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 4, 254, 72, "i32.atomic.rmw.cmpxchg", ""],
    [534 /* I64AtomicRmwCmpxchg */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 8, 254, 73, "i64.atomic.rmw.cmpxchg", ""],
    [535 /* I32AtomicRmw8CmpxchgU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 1, 254, 74, "i32.atomic.rmw8.cmpxchg_u", ""],
    [536 /* I32AtomicRmw16CmpxchgU */]: [0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 0 /* I32 */, 2, 254, 75, "i32.atomic.rmw16.cmpxchg_u", ""],
    [537 /* I64AtomicRmw8CmpxchgU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 1, 254, 76, "i64.atomic.rmw8.cmpxchg_u", ""],
    [538 /* I64AtomicRmw16CmpxchgU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 2, 254, 77, "i64.atomic.rmw16.cmpxchg_u", ""],
    [539 /* I64AtomicRmw32CmpxchgU */]: [1 /* I64 */, 0 /* I32 */, 1 /* I64 */, 1 /* I64 */, 4, 254, 78, "i64.atomic.rmw32.cmpxchg_u", ""],
    [540 /* Invalid */]: [14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 14 /* ___ */, 0, 0, 0, "", ""]
  };
})(Opcode || (Opcode = {}));

// src/common/token.ts
var import_assert = __toESM(require("assert"));
var Token = class {
  constructor(type, lexeme, line, col, indexInSource, opcodeType = null, valueType = null) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
    this.col = col;
    this.indexInSource = indexInSource;
    this.opcodeType = opcodeType;
    this.valueType = valueType;
  }
  static EofToken(lexeme, line, col, indexInSource) {
    return new Token("EOF" /* Eof */, lexeme, line, col, indexInSource, null, null);
  }
  isBareToken() {
    return isTokenTypeBare(this.type);
  }
  isStringToken() {
    return isTokenTypeString(this.type);
  }
  isValueToken() {
    return isTokenTypeType(this.type);
  }
  isOpcodeToken() {
    return isTokenTypeOpcode(this.type);
  }
  isOpcodeType(opcodeType) {
    return this.isOpcodeToken() && this.opcodeType === opcodeType;
  }
  isLiteral() {
    return isTokenTypeLiteral(this.type);
  }
  isReference() {
    return isTokenTypeRefKind(this.type);
  }
  getOpcodeParamLength() {
    (0, import_assert.default)(this.opcodeType !== null);
    return Opcode.getParamLength(this.opcodeType);
  }
  getOpcodeEncoding() {
    (0, import_assert.default)(this.opcodeType !== null);
    return Opcode.getCode(this.opcodeType);
  }
};
function isTokenTypeBare(token_type) {
  if (token_type === null)
    return false;
  return token_type === "Invalid" /* Invalid */ || token_type === "array" /* Array */ || token_type === "assert_exception" /* AssertException */ || token_type === "assert_exhaustion" /* AssertExhaustion */ || token_type === "assert_invalid" /* AssertInvalid */ || token_type === "assert_malformed" /* AssertMalformed */ || token_type === "assert_return" /* AssertReturn */ || token_type === "assert_trap" /* AssertTrap */ || token_type === "assert_unlinkable" /* AssertUnlinkable */ || token_type === "bin" /* Bin */ || token_type === "item" /* Item */ || token_type === "data" /* Data */ || token_type === "declare" /* Declare */ || token_type === "delegate" /* Delegate */ || token_type === "do" /* Do */ || token_type === "either" /* Either */ || token_type === "elem" /* Elem */ || token_type === "EOF" /* Eof */ || token_type === "tag" /* Tag */ || token_type === "export" /* Export */ || token_type === "field" /* Field */ || token_type === "get" /* Get */ || token_type === "global" /* Global */ || token_type === "import" /* Import */ || token_type === "invoke" /* Invoke */ || token_type === "input" /* Input */ || token_type === "local" /* Local */ || token_type === "(" /* Lpar */ || token_type === "memory" /* Memory */ || token_type === "module" /* Module */ || token_type === "mut" /* Mut */ || token_type === "nan:arithmetic" /* NanArithmetic */ || token_type === "nan:canonical" /* NanCanonical */ || token_type === "offset" /* Offset */ || token_type === "output" /* Output */ || token_type === "param" /* Param */ || token_type === "ref" /* Ref */ || token_type === "quote" /* Quote */ || token_type === "register" /* Register */ || token_type === "result" /* Result */ || token_type === ")" /* Rpar */ || token_type === "shared" /* Shared */ || token_type === "start" /* Start */ || token_type === "struct" /* Struct */ || token_type === "table" /* Table */ || token_type === "then" /* Then */ || token_type === "type" /* Type */ || token_type === "i8x16" /* I8X16 */ || token_type === "i16x8" /* I16X8 */ || token_type === "i32x4" /* I32X4 */ || token_type === "i64x2" /* I64X2 */ || token_type === "f32x4" /* F32X4 */ || token_type === "f64x2" /* F64X2 */;
}
function isTokenTypeString(token_type) {
  if (token_type === null)
    return false;
  return token_type === "align=" /* AlignEqNat */ || token_type === "Annotation" /* LparAnn */ || token_type === "offset=" /* OffsetEqNat */ || token_type === "Reserved" /* Reserved */ || token_type === "TEXT" /* Text */ || token_type === "VAR" /* Var */;
}
function isTokenTypeType(token_type) {
  if (token_type === null)
    return false;
  return token_type === "VALUETYPE" /* ValueType */;
}
function isTokenTypeOpcode(token_type) {
  if (token_type === null)
    return false;
  return token_type === "atomic.fence" /* AtomicFence */ || token_type === "ATOMIC_LOAD" /* AtomicLoad */ || token_type === "ATOMIC_NOTIFY" /* AtomicNotify */ || token_type === "ATOMIC_RMW" /* AtomicRmw */ || token_type === "ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */ || token_type === "ATOMIC_STORE" /* AtomicStore */ || token_type === "ATOMIC_WAIT" /* AtomicWait */ || token_type === "BINARY" /* Binary */ || token_type === "block" /* Block */ || token_type === "br" /* Br */ || token_type === "br_if" /* BrIf */ || token_type === "br_table" /* BrTable */ || token_type === "call" /* Call */ || token_type === "call_indirect" /* CallIndirect */ || token_type === "call_ref" /* CallRef */ || token_type === "catch" /* Catch */ || token_type === "catch_all" /* CatchAll */ || token_type === "COMPARE" /* Compare */ || token_type === "CONST" /* Const */ || token_type === "CONVERT" /* Convert */ || token_type === "data.drop" /* DataDrop */ || token_type === "drop" /* Drop */ || token_type === "elem.drop" /* ElemDrop */ || token_type === "else" /* Else */ || token_type === "end" /* End */ || token_type === "global.get" /* GlobalGet */ || token_type === "global.set" /* GlobalSet */ || token_type === "if" /* If */ || token_type === "LOAD" /* Load */ || token_type === "local.get" /* LocalGet */ || token_type === "local.set" /* LocalSet */ || token_type === "local.tee" /* LocalTee */ || token_type === "loop" /* Loop */ || token_type === "memory.copy" /* MemoryCopy */ || token_type === "memory.fill" /* MemoryFill */ || token_type === "memory.grow" /* MemoryGrow */ || token_type === "memory.init" /* MemoryInit */ || token_type === "memory.size" /* MemorySize */ || token_type === "nop" /* Nop */ || token_type === "ref.extern" /* RefExtern */ || token_type === "ref.func" /* RefFunc */ || token_type === "ref.is_null" /* RefIsNull */ || token_type === "ref.null" /* RefNull */ || token_type === "rethrow" /* Rethrow */ || token_type === "return_call_indirect" /* ReturnCallIndirect */ || token_type === "return_call" /* ReturnCall */ || token_type === "return" /* Return */ || token_type === "select" /* Select */ || token_type === "SIMDLANEOP" /* SimdLaneOp */ || token_type === "SIMDLOADSPLAT" /* SimdLoadSplat */ || token_type === "SIMDLOADLANE" /* SimdLoadLane */ || token_type === "SIMDSTORELANE" /* SimdStoreLane */ || token_type === "i8x16.shuffle" /* SimdShuffleOp */ || token_type === "STORE" /* Store */ || token_type === "table.copy" /* TableCopy */ || token_type === "table.full" /* TableFill */ || token_type === "table.get" /* TableGet */ || token_type === "table.grow" /* TableGrow */ || token_type === "table.init" /* TableInit */ || token_type === "table.set" /* TableSet */ || token_type === "table.size" /* TableSize */ || token_type === "TERNARY" /* Ternary */ || token_type === "throw" /* Throw */ || token_type === "try" /* Try */ || token_type === "UNARY" /* Unary */ || token_type === "unreachable" /* Unreachable */;
}
function isTokenTypeLiteral(token_type) {
  if (token_type === null)
    return false;
  return token_type === "FLOAT" /* Float */ || token_type === "INT" /* Int */ || token_type === "NAT" /* Nat */;
}
function isTokenTypeRefKind(token_type) {
  if (token_type === null)
    return false;
  return token_type === "func" /* Func */ || token_type === "extern" /* Extern */ || token_type === "exn" /* Exn */;
}

// src/common/export_types.ts
var ExportType = /* @__PURE__ */ ((ExportType2) => {
  ExportType2[ExportType2["Func"] = 0] = "Func";
  ExportType2[ExportType2["Table"] = 1] = "Table";
  ExportType2[ExportType2["Mem"] = 2] = "Mem";
  ExportType2[ExportType2["Global"] = 3] = "Global";
  return ExportType2;
})(ExportType || {});
((ExportType2) => {
  function getEncoding(e) {
    switch (e) {
      case 0 /* Func */:
        return 0;
      case 1 /* Table */:
        return 1;
      case 2 /* Mem */:
        return 2;
      case 3 /* Global */:
        return 3;
      default:
        throw new Error(`ExportType ${e} not recognized`);
    }
  }
  ExportType2.getEncoding = getEncoding;
})(ExportType || (ExportType = {}));

// src/parser/ir.ts
var IntermediateRepresentation = class {
};
var ModuleExpression = class extends IntermediateRepresentation {
  // TODO add support for multiple export expressions
  constructor(functionDeclarations, exportDeclarations) {
    super();
    /*
      Sections in modules:
        0  Custom (unused)
        1  Type (Function Signatures)
        2  Import
        3  Function (Function )
        4  Table
        5  Memory
        6  Global
        7  Export
        8  Start
        9  Element
        10 Code
        11 Data
        12 DataCount
    */
    // Type Section
    this.functionDeclarations = [];
    this.functionDeclarations = functionDeclarations;
    this.exportDeclarations = exportDeclarations;
  }
  getFunctionSignatures() {
    return this.functionDeclarations.map((func) => func.functionSignature);
  }
  getFunctionBodies() {
    return this.functionDeclarations.map((func) => func.functionBody);
  }
};
var ExportExpression = class extends IntermediateRepresentation {
  constructor(exportObjects) {
    super();
    this.exportObjects = exportObjects;
  }
};
var ExportObject = class {
  constructor(exportName, exportType, exportIndex) {
    if (exportName.type !== "TEXT" /* Text */) {
      throw new Error(`unexpected export name: ${exportName}`);
    }
    this.exportName = exportName.lexeme.slice(1, exportName.lexeme.length - 1);
    if (exportIndex.type !== "NAT" /* Nat */) {
      throw new Error(`unexpected export ID: ${exportIndex}. If this is meant to be a $identifier, then it is not implemented yet.`);
    }
    this.exportIndex = Number.parseInt(exportIndex.lexeme);
    if (exportType.type !== "func" /* Func */) {
      throw new Error(`unexpected export type: ${exportType}`);
    }
    this.exportType = 0 /* Func */;
  }
};
var FunctionExpression = class extends IntermediateRepresentation {
  constructor(paramTypes, returnTypes, paramNames, body, functionName) {
    super();
    this.functionSignature = new FunctionSignature(paramTypes, returnTypes, paramNames);
    this.functionBody = new FunctionBody(body, paramNames);
    this.functionName = functionName;
  }
};
var FunctionSignature = class {
  constructor(paramTypes, returnTypes, paramNames, functionName) {
    this.paramTypes = paramTypes;
    this.returnTypes = returnTypes;
    this.paramNames = paramNames;
    this.functionName = functionName;
  }
};
var FunctionBody = class {
  constructor(body, paramNames) {
    this.body = body;
    this.paramNames = paramNames;
  }
};
var Unfoldable;
((Unfoldable2) => {
  function instanceOf(obj) {
    return "unfold" in obj;
  }
  Unfoldable2.instanceOf = instanceOf;
})(Unfoldable || (Unfoldable = {}));
var OperationTree = class extends IntermediateRepresentation {
  constructor(operator, operands) {
    super();
    this.operator = operator;
    this.operands = operands;
  }
  unfold() {
    const unfoldedOperands = this.operands.flatMap((operand) => {
      if (operand instanceof Token) {
        return [operand];
      }
      return operand.unfold().tokens;
    });
    return new PureUnfoldedTokenExpression([...unfoldedOperands, this.operator]);
  }
};
var UnfoldedTokenExpression = class extends IntermediateRepresentation {
  constructor(tokens) {
    super();
    this.tokens = tokens;
  }
  unfold() {
    const unfoldedOperands = this.tokens.flatMap((token) => {
      if (token instanceof Token) {
        return [token];
      }
      return token.unfold().tokens;
    });
    return new PureUnfoldedTokenExpression(unfoldedOperands);
  }
};
var PureUnfoldedTokenExpression = class extends IntermediateRepresentation {
  constructor(tokens) {
    super();
    this.tokens = tokens;
  }
};

// src/binary_writer.ts
var import_assert2 = __toESM(require("assert"));
var SectionCode;
((SectionCode2) => {
  SectionCode2.Type = 1;
  SectionCode2.Import = 2;
  SectionCode2.Function = 3;
  SectionCode2.Table = 4;
  SectionCode2.Memory = 5;
  SectionCode2.Global = 6;
  SectionCode2.Export = 7;
  SectionCode2.Start = 8;
  SectionCode2.Element = 9;
  SectionCode2.Code = 10;
  SectionCode2.Data = 11;
})(SectionCode || (SectionCode = {}));
function encode(ir) {
  if (Unfoldable.instanceOf(ir)) {
    const unfolded = ir.unfold();
    return encode(unfolded);
  }
  if (ir instanceof PureUnfoldedTokenExpression) {
    return encodePureUnfoldedTokenExpression(ir);
  }
  if (ir instanceof FunctionSignature) {
    return encodeFunctionSignature(ir);
  }
  if (ir instanceof FunctionBody) {
    return encodeFunctionBody(ir);
  }
  if (ir instanceof ExportExpression) {
    return encodeExportExpression(ir);
  }
  if (ir instanceof ModuleExpression) {
    return encodeModule(ir);
  }
  throw new Error(`Unexpected Intermediate Representation: ${ir.constructor.name}, ${JSON.stringify(ir, void 0, 2)}`);
}
function encodeModule(ir) {
  return new Uint8Array([
    ...[0, "a".charCodeAt(0), "s".charCodeAt(0), "m".charCodeAt(0)],
    // magic number
    ...[1, 0, 0, 0],
    // version number
    ...encodeModuleTypeSection(ir),
    ...encodeModuleImportSection(ir),
    ...encodeModuleFunctionSection(ir),
    ...encodeModuleTableSection(ir),
    ...encodeModuleMemorySection(ir),
    ...encodeModuleGlobalSection(ir),
    ...encodeModuleExportSection(ir),
    ...encodeModuleStartSection(ir),
    ...encodeModuleElementSection(ir),
    ...encodeModuleCodeSection(ir),
    ...encodeModuleDataSection(ir)
  ]);
}
function encodeModuleTypeSection(ir) {
  const functions = ir.getFunctionSignatures();
  const numTypes = functions.length;
  let funcSignatureEncodings = [];
  functions.map(encode).forEach((arr) => {
    funcSignatureEncodings = funcSignatureEncodings.concat(...arr);
  });
  const sectionSize = funcSignatureEncodings.length + 1;
  return new Uint8Array([SectionCode.Type, sectionSize, numTypes, ...funcSignatureEncodings]);
}
function encodeModuleImportSection(ir) {
  return new Uint8Array([]);
}
function encodeModuleFunctionSection(ir) {
  const functions = ir.getFunctionSignatures();
  const num_fns = functions.length;
  const section_size = num_fns + 1;
  const function_indices = Array(num_fns).keys();
  return new Uint8Array([SectionCode.Function, section_size, num_fns, ...function_indices]);
}
function encodeModuleTableSection(ir) {
  return new Uint8Array([]);
}
function encodeModuleMemorySection(ir) {
  return new Uint8Array([]);
}
function encodeModuleGlobalSection(ir) {
  return new Uint8Array([]);
}
function encodeModuleExportSection(ir) {
  const { exportDeclarations } = ir;
  if (typeof exportDeclarations === "undefined") {
    return new Uint8Array([]);
  }
  const exportEncoding = encode(exportDeclarations);
  const sectionLength = exportEncoding.length;
  return new Uint8Array([SectionCode.Export, sectionLength, ...exportEncoding]);
}
function encodeModuleStartSection(ir) {
  return new Uint8Array([]);
}
function encodeModuleElementSection(ir) {
  return new Uint8Array([]);
}
function encodeModuleCodeSection(ir) {
  const fnBodies = ir.getFunctionBodies();
  const fnBodyEncodings = [];
  fnBodies.forEach((body) => {
    fnBodyEncodings.push(...encode(body));
  });
  const sectionSize = fnBodyEncodings.length + 1;
  const fnNumber = fnBodies.length;
  return new Uint8Array([SectionCode.Code, sectionSize, fnNumber, ...fnBodyEncodings]);
}
function encodeModuleDataSection(ir) {
  return new Uint8Array([]);
}
function encodePureUnfoldedTokenExpression(ir) {
  const binary = [];
  for (const [index, token] of ir.tokens.entries()) {
    if (!isLiteralToken(token)) {
      binary.push(...encodeNonLiteralToken(token));
    } else {
      const prevToken = ir.tokens[index - 1];
      binary.push(...encodeLiteralToken(prevToken, token));
    }
  }
  return new Uint8Array(binary);
}
function encodeExportExpression(ir) {
  const { exportObjects } = ir;
  const exportNum = exportObjects.length;
  const exportEncodings = [];
  for (const exportObj of exportObjects) {
    exportEncodings.push(...encodeExportObject(exportObj));
  }
  return new Uint8Array([exportNum, ...exportEncodings]);
}
function encodeExportObject(obj) {
  const { exportIndex, exportName, exportType } = obj;
  const exportNameEncoding = [];
  for (let i = 0; i < exportName.length; i++) {
    exportNameEncoding.push(exportName.charCodeAt(i));
  }
  return new Uint8Array([exportName.length, ...exportNameEncoding, ExportType.getEncoding(exportType), exportIndex]);
}
function encodeFunctionSignature(ir) {
  const FUNCTION_SIG_PREFIX = 96;
  const param_encoding = ir.paramTypes.map((type) => ValueType.getValue(type));
  const param_len = param_encoding.length;
  const result_encoding = ir.returnTypes.map((type) => ValueType.getValue(type));
  const result_len = result_encoding.length;
  return new Uint8Array([FUNCTION_SIG_PREFIX, param_len, ...param_encoding, result_len, ...result_encoding]);
}
function encodeFunctionBody(ir) {
  const unfoldedBody = ir.body.unfold();
  const paramNames = ir.paramNames;
  for (let i = 0; i < unfoldedBody.tokens.length; i++) {
    const token = unfoldedBody.tokens[i];
    if (token.type === "VAR" /* Var */) {
      const index = paramNames.indexOf(token.lexeme);
      if (index === -1) {
        throw new Error(`Parameter name not found in function body: ${JSON.stringify(ir, void 0, 2)}`);
      }
      unfoldedBody.tokens[i] = convertVarToIndexToken(token, index);
    }
  }
  const encodedBody = encode(unfoldedBody);
  const FUNCTION_END = 11;
  return new Uint8Array([encodedBody.length + 2, 0, ...encodedBody, FUNCTION_END]);
}
function convertVarToIndexToken(varToken, index) {
  (0, import_assert2.default)(Number.isInteger(index));
  (0, import_assert2.default)(index >= 0);
  return new Token(
    "NAT" /* Nat */,
    index.toString(),
    varToken.line,
    varToken.col,
    varToken.indexInSource,
    null,
    null
  );
}
function isLiteralToken(token) {
  return token.type === "NAT" /* Nat */ || token.type === "FLOAT" /* Float */;
}
function encodeNonLiteralToken(token) {
  if (token.isValueToken()) {
    return new Uint8Array([ValueType.getValue(token.valueType)]);
  }
  if (token.isOpcodeToken()) {
    return new Uint8Array([Opcode.getCode(token.opcodeType)]);
  }
  throw new Error(`Unexpected token: ${token}`);
}
function encodeLiteralToken(prevToken, token) {
  if (prevToken.isOpcodeType(58 /* F64Const */)) {
    return NumberEncoder.encodeF64Const(
      /^\d+$/u.test(token.lexeme) ? Number.parseInt(token.lexeme) : Number.parseFloat(token.lexeme)
    );
  }
  if (prevToken.type === "local.get" /* LocalGet */) {
    (0, import_assert2.default)(token.type === "NAT" /* Nat */);
    return new Uint8Array([Number.parseInt(token.lexeme)]);
  }
  throw new Error(`Unsuppored literal token type: [${JSON.stringify(prevToken, void 0, 2)}, ${JSON.stringify(token, void 0, 2)}]`);
}
var NumberEncoder;
((NumberEncoder2) => {
  function encodeF64Const(n) {
    let buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, n);
    let bytes = new Uint8Array(buffer);
    return bytes.reverse();
  }
  NumberEncoder2.encodeF64Const = encodeF64Const;
})(NumberEncoder || (NumberEncoder = {}));

// src/lexer/lexer.ts
var import_assert4 = __toESM(require("assert"));

// src/common/literal.ts
var import_assert3 = __toESM(require("assert"));
function parseHexdigit(c) {
  (0, import_assert3.default)(c.length === 1);
  switch (c) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      return Number.parseInt(c);
    case "a":
    case "A":
      return 10;
    case "B":
    case "b":
      return 11;
    case "C":
    case "c":
      return 12;
    case "D":
    case "d":
      return 13;
    case "E":
    case "e":
      return 14;
    case "F":
    case "f":
      return 15;
  }
  throw new Error(`Invalid HexDigit: ${c}`);
}

// src/common/keywords.ts
var wordlist = {
  "array": ["array" /* Array */, null, 12 /* Array */],
  "assert_exception": ["assert_exception" /* AssertException */, null, null],
  "assert_exhaustion": ["assert_exhaustion" /* AssertExhaustion */, null, null],
  "assert_invalid": ["assert_invalid" /* AssertInvalid */, null, null],
  "assert_malformed": ["assert_malformed" /* AssertMalformed */, null, null],
  "assert_return": ["assert_return" /* AssertReturn */, null, null],
  "assert_trap": ["assert_trap" /* AssertTrap */, null, null],
  "assert_unlinkable": ["assert_unlinkable" /* AssertUnlinkable */, null, null],
  "atomic.fence": ["atomic.fence" /* AtomicFence */, 476 /* AtomicFence */, null],
  "binary": ["bin" /* Bin */, null, null],
  "block": ["block" /* Block */, 2 /* Block */, null],
  "br_if": ["br_if" /* BrIf */, 12 /* BrIf */, null],
  "br_table": ["br_table" /* BrTable */, 13 /* BrTable */, null],
  "br": ["br" /* Br */, 11 /* Br */, null],
  "call_indirect": ["call_indirect" /* CallIndirect */, 16 /* CallIndirect */, null],
  "call_ref": ["call_ref" /* CallRef */, 19 /* CallRef */, null],
  "call": ["call" /* Call */, 15 /* Call */, null],
  "catch": ["catch" /* Catch */, 7 /* Catch */, null],
  "catch_all": ["catch_all" /* CatchAll */, 21 /* CatchAll */, null],
  "data.drop": ["data.drop" /* DataDrop */, 203 /* DataDrop */, null],
  "data": ["data" /* Data */, null, null],
  "declare": ["declare" /* Declare */, null, null],
  "delegate": ["delegate" /* Delegate */, null, null],
  "do": ["do" /* Do */, null, null],
  "drop": ["drop" /* Drop */, 22 /* Drop */, null],
  "either": ["either" /* Either */, null, null],
  "elem.drop": ["elem.drop" /* ElemDrop */, 207 /* ElemDrop */, null],
  "elem": ["elem" /* Elem */, null, null],
  "else": ["else" /* Else */, 5 /* Else */, null],
  "end": ["end" /* End */, 10 /* End */, null],
  "tag": ["tag" /* Tag */, null, null],
  "extern": ["extern" /* Extern */, null, 8 /* ExternRef */],
  "externref": ["VALUETYPE" /* ValueType */, null, 8 /* ExternRef */],
  "export": ["export" /* Export */, null, null],
  "f32.abs": ["UNARY" /* Unary */, 129 /* F32Abs */, null],
  "f32.add": ["BINARY" /* Binary */, 136 /* F32Add */, null],
  "f32.ceil": ["UNARY" /* Unary */, 131 /* F32Ceil */, null],
  "f32.const": ["CONST" /* Const */, 57 /* F32Const */, null],
  "f32.convert_i32_s": ["CONVERT" /* Convert */, 168 /* F32ConvertI32S */, null],
  "f32.convert_i32_u": ["CONVERT" /* Convert */, 169 /* F32ConvertI32U */, null],
  "f32.convert_i64_s": ["CONVERT" /* Convert */, 170 /* F32ConvertI64S */, null],
  "f32.convert_i64_u": ["CONVERT" /* Convert */, 171 /* F32ConvertI64U */, null],
  "f32.copysign": ["BINARY" /* Binary */, 142 /* F32Copysign */, null],
  "f32.demote_f64": ["CONVERT" /* Convert */, 172 /* F32DemoteF64 */, null],
  "f32.div": ["BINARY" /* Binary */, 139 /* F32Div */, null],
  "f32.eq": ["COMPARE" /* Compare */, 81 /* F32Eq */, null],
  "f32.floor": ["UNARY" /* Unary */, 132 /* F32Floor */, null],
  "f32.ge": ["COMPARE" /* Compare */, 86 /* F32Ge */, null],
  "f32.gt": ["COMPARE" /* Compare */, 84 /* F32Gt */, null],
  "f32.le": ["COMPARE" /* Compare */, 85 /* F32Le */, null],
  "f32.load": ["LOAD" /* Load */, 32 /* F32Load */, null],
  "f32.lt": ["COMPARE" /* Compare */, 83 /* F32Lt */, null],
  "f32.max": ["BINARY" /* Binary */, 141 /* F32Max */, null],
  "f32.min": ["BINARY" /* Binary */, 140 /* F32Min */, null],
  "f32.mul": ["BINARY" /* Binary */, 138 /* F32Mul */, null],
  "f32.nearest": ["UNARY" /* Unary */, 134 /* F32Nearest */, null],
  "f32.neg": ["UNARY" /* Unary */, 130 /* F32Neg */, null],
  "f32.ne": ["COMPARE" /* Compare */, 82 /* F32Ne */, null],
  "f32.reinterpret_i32": ["CONVERT" /* Convert */, 180 /* F32ReinterpretI32 */, null],
  "f32.sqrt": ["UNARY" /* Unary */, 135 /* F32Sqrt */, null],
  "f32.store": ["STORE" /* Store */, 46 /* F32Store */, null],
  "f32.sub": ["BINARY" /* Binary */, 137 /* F32Sub */, null],
  "f32.trunc": ["UNARY" /* Unary */, 133 /* F32Trunc */, null],
  "f32": ["VALUETYPE" /* ValueType */, null, 2 /* F32 */],
  "f32x4.abs": ["UNARY" /* Unary */, 423 /* F32X4Abs */, null],
  "f32x4.add": ["BINARY" /* Binary */, 426 /* F32X4Add */, null],
  "f32x4.ceil": ["UNARY" /* Unary */, 415 /* F32X4Ceil */, null],
  "f32x4.convert_i32x4_s": ["UNARY" /* Unary */, 447 /* F32X4ConvertI32X4S */, null],
  "f32x4.convert_i32x4_u": ["UNARY" /* Unary */, 448 /* F32X4ConvertI32X4U */, null],
  "f32x4.div": ["BINARY" /* Binary */, 429 /* F32X4Div */, null],
  "f32x4.eq": ["COMPARE" /* Compare */, 282 /* F32X4Eq */, null],
  "f32x4.extract_lane": ["SIMDLANEOP" /* SimdLaneOp */, 248 /* F32X4ExtractLane */, null],
  "f32x4.floor": ["UNARY" /* Unary */, 416 /* F32X4Floor */, null],
  "f32x4.ge": ["COMPARE" /* Compare */, 287 /* F32X4Ge */, null],
  "f32x4.gt": ["COMPARE" /* Compare */, 285 /* F32X4Gt */, null],
  "f32x4.le": ["COMPARE" /* Compare */, 286 /* F32X4Le */, null],
  "f32x4.lt": ["COMPARE" /* Compare */, 284 /* F32X4Lt */, null],
  "f32x4.max": ["BINARY" /* Binary */, 431 /* F32X4Max */, null],
  "f32x4.min": ["BINARY" /* Binary */, 430 /* F32X4Min */, null],
  "f32x4.mul": ["BINARY" /* Binary */, 428 /* F32X4Mul */, null],
  "f32x4.nearest": ["UNARY" /* Unary */, 418 /* F32X4Nearest */, null],
  "f32x4.neg": ["UNARY" /* Unary */, 424 /* F32X4Neg */, null],
  "f32x4.ne": ["COMPARE" /* Compare */, 283 /* F32X4Ne */, null],
  "f32x4.pmax": ["BINARY" /* Binary */, 433 /* F32X4PMax */, null],
  "f32x4.pmin": ["BINARY" /* Binary */, 432 /* F32X4PMin */, null],
  "f32x4.relaxed_madd": ["TERNARY" /* Ternary */, 458 /* F32X4RelaxedMadd */, null],
  "f32x4.relaxed_max": ["BINARY" /* Binary */, 467 /* F32X4RelaxedMax */, null],
  "f32x4.relaxed_min": ["BINARY" /* Binary */, 466 /* F32X4RelaxedMin */, null],
  "f32x4.relaxed_nmadd": ["TERNARY" /* Ternary */, 459 /* F32X4RelaxedNmadd */, null],
  "f32x4.replace_lane": ["SIMDLANEOP" /* SimdLaneOp */, 249 /* F32X4ReplaceLane */, null],
  "f32x4.splat": ["UNARY" /* Unary */, 236 /* F32X4Splat */, null],
  "f32x4.sqrt": ["UNARY" /* Unary */, 425 /* F32X4Sqrt */, null],
  "f32x4.sub": ["BINARY" /* Binary */, 427 /* F32X4Sub */, null],
  "f32x4.trunc": ["UNARY" /* Unary */, 417 /* F32X4Trunc */, null],
  "f32x4.demote_f64x2_zero": ["UNARY" /* Unary */, 311 /* F32X4DemoteF64X2Zero */, null],
  "f32x4": ["f32x4" /* F32X4 */, null, null],
  "f64.abs": ["UNARY" /* Unary */, 143 /* F64Abs */, null],
  "f64.add": ["BINARY" /* Binary */, 150 /* F64Add */, null],
  "f64.ceil": ["UNARY" /* Unary */, 145 /* F64Ceil */, null],
  "f64.const": ["CONST" /* Const */, 58 /* F64Const */, null],
  "f64.convert_i32_s": ["CONVERT" /* Convert */, 173 /* F64ConvertI32S */, null],
  "f64.convert_i32_u": ["CONVERT" /* Convert */, 174 /* F64ConvertI32U */, null],
  "f64.convert_i64_s": ["CONVERT" /* Convert */, 175 /* F64ConvertI64S */, null],
  "f64.convert_i64_u": ["CONVERT" /* Convert */, 176 /* F64ConvertI64U */, null],
  "f64.copysign": ["BINARY" /* Binary */, 156 /* F64Copysign */, null],
  "f64.div": ["BINARY" /* Binary */, 153 /* F64Div */, null],
  "f64.eq": ["COMPARE" /* Compare */, 87 /* F64Eq */, null],
  "f64.floor": ["UNARY" /* Unary */, 146 /* F64Floor */, null],
  "f64.ge": ["COMPARE" /* Compare */, 92 /* F64Ge */, null],
  "f64.gt": ["COMPARE" /* Compare */, 90 /* F64Gt */, null],
  "f64.le": ["COMPARE" /* Compare */, 91 /* F64Le */, null],
  "f64.load": ["LOAD" /* Load */, 33 /* F64Load */, null],
  "f64.lt": ["COMPARE" /* Compare */, 89 /* F64Lt */, null],
  "f64.max": ["BINARY" /* Binary */, 155 /* F64Max */, null],
  "f64.min": ["BINARY" /* Binary */, 154 /* F64Min */, null],
  "f64.mul": ["BINARY" /* Binary */, 152 /* F64Mul */, null],
  "f64.nearest": ["UNARY" /* Unary */, 148 /* F64Nearest */, null],
  "f64.neg": ["UNARY" /* Unary */, 144 /* F64Neg */, null],
  "f64.ne": ["COMPARE" /* Compare */, 88 /* F64Ne */, null],
  "f64.promote_f32": ["CONVERT" /* Convert */, 177 /* F64PromoteF32 */, null],
  "f64.reinterpret_i64": ["CONVERT" /* Convert */, 181 /* F64ReinterpretI64 */, null],
  "f64.sqrt": ["UNARY" /* Unary */, 149 /* F64Sqrt */, null],
  "f64.store": ["STORE" /* Store */, 47 /* F64Store */, null],
  "f64.sub": ["BINARY" /* Binary */, 151 /* F64Sub */, null],
  "f64.trunc": ["UNARY" /* Unary */, 147 /* F64Trunc */, null],
  "f64": ["VALUETYPE" /* ValueType */, null, 3 /* F64 */],
  "f64x2.abs": ["UNARY" /* Unary */, 434 /* F64X2Abs */, null],
  "f64x2.add": ["BINARY" /* Binary */, 437 /* F64X2Add */, null],
  "f64x2.ceil": ["UNARY" /* Unary */, 419 /* F64X2Ceil */, null],
  "f64x2.div": ["BINARY" /* Binary */, 440 /* F64X2Div */, null],
  "f64x2.eq": ["COMPARE" /* Compare */, 288 /* F64X2Eq */, null],
  "f64x2.extract_lane": ["SIMDLANEOP" /* SimdLaneOp */, 250 /* F64X2ExtractLane */, null],
  "f64x2.floor": ["UNARY" /* Unary */, 420 /* F64X2Floor */, null],
  "f64x2.ge": ["COMPARE" /* Compare */, 293 /* F64X2Ge */, null],
  "f64x2.gt": ["COMPARE" /* Compare */, 291 /* F64X2Gt */, null],
  "f64x2.le": ["COMPARE" /* Compare */, 292 /* F64X2Le */, null],
  "f64x2.lt": ["COMPARE" /* Compare */, 290 /* F64X2Lt */, null],
  "f64x2.max": ["BINARY" /* Binary */, 442 /* F64X2Max */, null],
  "f64x2.min": ["BINARY" /* Binary */, 441 /* F64X2Min */, null],
  "f64x2.mul": ["BINARY" /* Binary */, 439 /* F64X2Mul */, null],
  "f64x2.nearest": ["UNARY" /* Unary */, 422 /* F64X2Nearest */, null],
  "f64x2.neg": ["UNARY" /* Unary */, 435 /* F64X2Neg */, null],
  "f64x2.ne": ["COMPARE" /* Compare */, 289 /* F64X2Ne */, null],
  "f64x2.pmax": ["BINARY" /* Binary */, 444 /* F64X2PMax */, null],
  "f64x2.pmin": ["BINARY" /* Binary */, 443 /* F64X2PMin */, null],
  "f64x2.relaxed_madd": ["TERNARY" /* Ternary */, 460 /* F64X2RelaxedMadd */, null],
  "f64x2.relaxed_max": ["BINARY" /* Binary */, 469 /* F64X2RelaxedMax */, null],
  "f64x2.relaxed_min": ["BINARY" /* Binary */, 468 /* F64X2RelaxedMin */, null],
  "f64x2.relaxed_nmadd": ["TERNARY" /* Ternary */, 461 /* F64X2RelaxedNmadd */, null],
  "f64x2.replace_lane": ["SIMDLANEOP" /* SimdLaneOp */, 251 /* F64X2ReplaceLane */, null],
  "f64x2.splat": ["UNARY" /* Unary */, 237 /* F64X2Splat */, null],
  "f64x2.sqrt": ["UNARY" /* Unary */, 436 /* F64X2Sqrt */, null],
  "f64x2.sub": ["BINARY" /* Binary */, 438 /* F64X2Sub */, null],
  "f64x2.trunc": ["UNARY" /* Unary */, 421 /* F64X2Trunc */, null],
  "f64x2.convert_low_i32x4_s": ["UNARY" /* Unary */, 451 /* F64X2ConvertLowI32X4S */, null],
  "f64x2.convert_low_i32x4_u": ["UNARY" /* Unary */, 452 /* F64X2ConvertLowI32X4U */, null],
  "f64x2.promote_low_f32x4": ["UNARY" /* Unary */, 312 /* F64X2PromoteLowF32X4 */, null],
  "f64x2": ["f64x2" /* F64X2 */, null, null],
  "field": ["field" /* Field */, null, null],
  "funcref": ["VALUETYPE" /* ValueType */, null, 7 /* FuncRef */],
  "func": ["func" /* Func */, null, 7 /* FuncRef */],
  "get": ["get" /* Get */, null, null],
  "global.get": ["global.get" /* GlobalGet */, 28 /* GlobalGet */, null],
  "global.set": ["global.set" /* GlobalSet */, 29 /* GlobalSet */, null],
  "global": ["global" /* Global */, null, null],
  "i16x8.abs": ["UNARY" /* Unary */, 338 /* I16X8Abs */, null],
  "i16x8.add_sat_s": ["BINARY" /* Binary */, 353 /* I16X8AddSatS */, null],
  "i16x8.add_sat_u": ["BINARY" /* Binary */, 354 /* I16X8AddSatU */, null],
  "i16x8.add": ["BINARY" /* Binary */, 352 /* I16X8Add */, null],
  "i16x8.all_true": ["UNARY" /* Unary */, 341 /* I16X8AllTrue */, null],
  "i16x8.avgr_u": ["BINARY" /* Binary */, 363 /* I16X8AvgrU */, null],
  "i16x8.bitmask": ["UNARY" /* Unary */, 342 /* I16X8Bitmask */, null],
  "i16x8.dot_i8x16_i7x16_s": ["BINARY" /* Binary */, 471 /* I16X8DotI8X16I7X16S */, null],
  "i16x8.eq": ["COMPARE" /* Compare */, 262 /* I16X8Eq */, null],
  "i16x8.extract_lane_s": ["SIMDLANEOP" /* SimdLaneOp */, 241 /* I16X8ExtractLaneS */, null],
  "i16x8.extract_lane_u": ["SIMDLANEOP" /* SimdLaneOp */, 242 /* I16X8ExtractLaneU */, null],
  "i16x8.ge_s": ["COMPARE" /* Compare */, 270 /* I16X8GeS */, null],
  "i16x8.ge_u": ["COMPARE" /* Compare */, 271 /* I16X8GeU */, null],
  "i16x8.gt_s": ["COMPARE" /* Compare */, 266 /* I16X8GtS */, null],
  "i16x8.gt_u": ["COMPARE" /* Compare */, 267 /* I16X8GtU */, null],
  "i16x8.le_s": ["COMPARE" /* Compare */, 268 /* I16X8LeS */, null],
  "i16x8.le_u": ["COMPARE" /* Compare */, 269 /* I16X8LeU */, null],
  "v128.load8x8_s": ["LOAD" /* Load */, 218 /* V128Load8X8S */, null],
  "v128.load8x8_u": ["LOAD" /* Load */, 219 /* V128Load8X8U */, null],
  "i16x8.lt_s": ["COMPARE" /* Compare */, 264 /* I16X8LtS */, null],
  "i16x8.lt_u": ["COMPARE" /* Compare */, 265 /* I16X8LtU */, null],
  "i16x8.max_s": ["BINARY" /* Binary */, 361 /* I16X8MaxS */, null],
  "i16x8.max_u": ["BINARY" /* Binary */, 362 /* I16X8MaxU */, null],
  "i16x8.min_s": ["BINARY" /* Binary */, 359 /* I16X8MinS */, null],
  "i16x8.min_u": ["BINARY" /* Binary */, 360 /* I16X8MinU */, null],
  "i16x8.mul": ["BINARY" /* Binary */, 358 /* I16X8Mul */, null],
  "i16x8.narrow_i32x4_s": ["BINARY" /* Binary */, 343 /* I16X8NarrowI32X4S */, null],
  "i16x8.narrow_i32x4_u": ["BINARY" /* Binary */, 344 /* I16X8NarrowI32X4U */, null],
  "i16x8.neg": ["UNARY" /* Unary */, 339 /* I16X8Neg */, null],
  "i16x8.q15mulr_sat_s": ["BINARY" /* Binary */, 340 /* I16X8Q15mulrSatS */, null],
  "i16x8.ne": ["COMPARE" /* Compare */, 263 /* I16X8Ne */, null],
  "i16x8.relaxed_laneselect": ["TERNARY" /* Ternary */, 463 /* I16X8RelaxedLaneSelect */, null],
  "i16x8.relaxed_q15mulr_s": ["BINARY" /* Binary */, 470 /* I16X8RelaxedQ15mulrS */, null],
  "i16x8.replace_lane": ["SIMDLANEOP" /* SimdLaneOp */, 243 /* I16X8ReplaceLane */, null],
  "i16x8.shl": ["BINARY" /* Binary */, 349 /* I16X8Shl */, null],
  "i16x8.shr_s": ["BINARY" /* Binary */, 350 /* I16X8ShrS */, null],
  "i16x8.shr_u": ["BINARY" /* Binary */, 351 /* I16X8ShrU */, null],
  "i16x8.splat": ["UNARY" /* Unary */, 233 /* I16X8Splat */, null],
  "i16x8.sub_sat_s": ["BINARY" /* Binary */, 356 /* I16X8SubSatS */, null],
  "i16x8.sub_sat_u": ["BINARY" /* Binary */, 357 /* I16X8SubSatU */, null],
  "i16x8.sub": ["BINARY" /* Binary */, 355 /* I16X8Sub */, null],
  "i16x8.extadd_pairwise_i8x16_s": ["UNARY" /* Unary */, 334 /* I16X8ExtaddPairwiseI8X16S */, null],
  "i16x8.extadd_pairwise_i8x16_u": ["UNARY" /* Unary */, 335 /* I16X8ExtaddPairwiseI8X16U */, null],
  "i16x8.extmul_low_i8x16_s": ["BINARY" /* Binary */, 364 /* I16X8ExtmulLowI8X16S */, null],
  "i16x8.extmul_high_i8x16_s": ["BINARY" /* Binary */, 365 /* I16X8ExtmulHighI8X16S */, null],
  "i16x8.extmul_low_i8x16_u": ["BINARY" /* Binary */, 366 /* I16X8ExtmulLowI8X16U */, null],
  "i16x8.extmul_high_i8x16_u": ["BINARY" /* Binary */, 367 /* I16X8ExtmulHighI8X16U */, null],
  "i16x8": ["i16x8" /* I16X8 */, null, null],
  "i16x8.extend_high_i8x16_s": ["UNARY" /* Unary */, 346 /* I16X8ExtendHighI8X16S */, null],
  "i16x8.extend_high_i8x16_u": ["UNARY" /* Unary */, 348 /* I16X8ExtendHighI8X16U */, null],
  "i16x8.extend_low_i8x16_s": ["UNARY" /* Unary */, 345 /* I16X8ExtendLowI8X16S */, null],
  "i16x8.extend_low_i8x16_u": ["UNARY" /* Unary */, 347 /* I16X8ExtendLowI8X16U */, null],
  "i32.add": ["BINARY" /* Binary */, 96 /* I32Add */, null],
  "i32.and": ["BINARY" /* Binary */, 103 /* I32And */, null],
  "i32.atomic.load16_u": ["ATOMIC_LOAD" /* AtomicLoad */, 480 /* I32AtomicLoad16U */, null],
  "i32.atomic.load8_u": ["ATOMIC_LOAD" /* AtomicLoad */, 479 /* I32AtomicLoad8U */, null],
  "i32.atomic.load": ["ATOMIC_LOAD" /* AtomicLoad */, 477 /* I32AtomicLoad */, null],
  "i32.atomic.rmw16.add_u": ["ATOMIC_RMW" /* AtomicRmw */, 494 /* I32AtomicRmw16AddU */, null],
  "i32.atomic.rmw16.and_u": ["ATOMIC_RMW" /* AtomicRmw */, 508 /* I32AtomicRmw16AndU */, null],
  "i32.atomic.rmw16.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */, 536 /* I32AtomicRmw16CmpxchgU */, null],
  "i32.atomic.rmw16.or_u": ["ATOMIC_RMW" /* AtomicRmw */, 515 /* I32AtomicRmw16OrU */, null],
  "i32.atomic.rmw16.sub_u": ["ATOMIC_RMW" /* AtomicRmw */, 501 /* I32AtomicRmw16SubU */, null],
  "i32.atomic.rmw16.xchg_u": ["ATOMIC_RMW" /* AtomicRmw */, 529 /* I32AtomicRmw16XchgU */, null],
  "i32.atomic.rmw16.xor_u": ["ATOMIC_RMW" /* AtomicRmw */, 522 /* I32AtomicRmw16XorU */, null],
  "i32.atomic.rmw8.add_u": ["ATOMIC_RMW" /* AtomicRmw */, 493 /* I32AtomicRmw8AddU */, null],
  "i32.atomic.rmw8.and_u": ["ATOMIC_RMW" /* AtomicRmw */, 507 /* I32AtomicRmw8AndU */, null],
  "i32.atomic.rmw8.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */, 535 /* I32AtomicRmw8CmpxchgU */, null],
  "i32.atomic.rmw8.or_u": ["ATOMIC_RMW" /* AtomicRmw */, 514 /* I32AtomicRmw8OrU */, null],
  "i32.atomic.rmw8.sub_u": ["ATOMIC_RMW" /* AtomicRmw */, 500 /* I32AtomicRmw8SubU */, null],
  "i32.atomic.rmw8.xchg_u": ["ATOMIC_RMW" /* AtomicRmw */, 528 /* I32AtomicRmw8XchgU */, null],
  "i32.atomic.rmw8.xor_u": ["ATOMIC_RMW" /* AtomicRmw */, 521 /* I32AtomicRmw8XorU */, null],
  "i32.atomic.rmw.add": ["ATOMIC_RMW" /* AtomicRmw */, 491 /* I32AtomicRmwAdd */, null],
  "i32.atomic.rmw.and": ["ATOMIC_RMW" /* AtomicRmw */, 505 /* I32AtomicRmwAnd */, null],
  "i32.atomic.rmw.cmpxchg": ["ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */, 533 /* I32AtomicRmwCmpxchg */, null],
  "i32.atomic.rmw.or": ["ATOMIC_RMW" /* AtomicRmw */, 512 /* I32AtomicRmwOr */, null],
  "i32.atomic.rmw.sub": ["ATOMIC_RMW" /* AtomicRmw */, 498 /* I32AtomicRmwSub */, null],
  "i32.atomic.rmw.xchg": ["ATOMIC_RMW" /* AtomicRmw */, 526 /* I32AtomicRmwXchg */, null],
  "i32.atomic.rmw.xor": ["ATOMIC_RMW" /* AtomicRmw */, 519 /* I32AtomicRmwXor */, null],
  "i32.atomic.store16": ["ATOMIC_STORE" /* AtomicStore */, 487 /* I32AtomicStore16 */, null],
  "i32.atomic.store8": ["ATOMIC_STORE" /* AtomicStore */, 486 /* I32AtomicStore8 */, null],
  "i32.atomic.store": ["ATOMIC_STORE" /* AtomicStore */, 484 /* I32AtomicStore */, null],
  "i32.clz": ["UNARY" /* Unary */, 93 /* I32Clz */, null],
  "i32.const": ["CONST" /* Const */, 55 /* I32Const */, null],
  "i32.ctz": ["UNARY" /* Unary */, 94 /* I32Ctz */, null],
  "i32.div_s": ["BINARY" /* Binary */, 99 /* I32DivS */, null],
  "i32.div_u": ["BINARY" /* Binary */, 100 /* I32DivU */, null],
  "i32.eq": ["COMPARE" /* Compare */, 60 /* I32Eq */, null],
  "i32.eqz": ["CONVERT" /* Convert */, 59 /* I32Eqz */, null],
  "i32.extend16_s": ["UNARY" /* Unary */, 183 /* I32Extend16S */, null],
  "i32.extend8_s": ["UNARY" /* Unary */, 182 /* I32Extend8S */, null],
  "i32.ge_s": ["COMPARE" /* Compare */, 68 /* I32GeS */, null],
  "i32.ge_u": ["COMPARE" /* Compare */, 69 /* I32GeU */, null],
  "i32.gt_s": ["COMPARE" /* Compare */, 64 /* I32GtS */, null],
  "i32.gt_u": ["COMPARE" /* Compare */, 65 /* I32GtU */, null],
  "i32.le_s": ["COMPARE" /* Compare */, 66 /* I32LeS */, null],
  "i32.le_u": ["COMPARE" /* Compare */, 67 /* I32LeU */, null],
  "i32.load16_s": ["LOAD" /* Load */, 36 /* I32Load16S */, null],
  "i32.load16_u": ["LOAD" /* Load */, 37 /* I32Load16U */, null],
  "i32.load8_s": ["LOAD" /* Load */, 34 /* I32Load8S */, null],
  "i32.load8_u": ["LOAD" /* Load */, 35 /* I32Load8U */, null],
  "i32.load": ["LOAD" /* Load */, 30 /* I32Load */, null],
  "i32.lt_s": ["COMPARE" /* Compare */, 62 /* I32LtS */, null],
  "i32.lt_u": ["COMPARE" /* Compare */, 63 /* I32LtU */, null],
  "i32.mul": ["BINARY" /* Binary */, 98 /* I32Mul */, null],
  "i32.ne": ["COMPARE" /* Compare */, 61 /* I32Ne */, null],
  "i32.or": ["BINARY" /* Binary */, 104 /* I32Or */, null],
  "i32.popcnt": ["UNARY" /* Unary */, 95 /* I32Popcnt */, null],
  "i32.reinterpret_f32": ["CONVERT" /* Convert */, 178 /* I32ReinterpretF32 */, null],
  "i32.rem_s": ["BINARY" /* Binary */, 101 /* I32RemS */, null],
  "i32.rem_u": ["BINARY" /* Binary */, 102 /* I32RemU */, null],
  "i32.rotl": ["BINARY" /* Binary */, 109 /* I32Rotl */, null],
  "i32.rotr": ["BINARY" /* Binary */, 110 /* I32Rotr */, null],
  "i32.shl": ["BINARY" /* Binary */, 106 /* I32Shl */, null],
  "i32.shr_s": ["BINARY" /* Binary */, 107 /* I32ShrS */, null],
  "i32.shr_u": ["BINARY" /* Binary */, 108 /* I32ShrU */, null],
  "i32.store16": ["STORE" /* Store */, 49 /* I32Store16 */, null],
  "i32.store8": ["STORE" /* Store */, 48 /* I32Store8 */, null],
  "i32.store": ["STORE" /* Store */, 44 /* I32Store */, null],
  "i32.sub": ["BINARY" /* Binary */, 97 /* I32Sub */, null],
  "i32.trunc_f32_s": ["CONVERT" /* Convert */, 158 /* I32TruncF32S */, null],
  "i32.trunc_f32_u": ["CONVERT" /* Convert */, 159 /* I32TruncF32U */, null],
  "i32.trunc_f64_s": ["CONVERT" /* Convert */, 160 /* I32TruncF64S */, null],
  "i32.trunc_f64_u": ["CONVERT" /* Convert */, 161 /* I32TruncF64U */, null],
  "i32.trunc_sat_f32_s": ["CONVERT" /* Convert */, 194 /* I32TruncSatF32S */, null],
  "i32.trunc_sat_f32_u": ["CONVERT" /* Convert */, 195 /* I32TruncSatF32U */, null],
  "i32.trunc_sat_f64_s": ["CONVERT" /* Convert */, 196 /* I32TruncSatF64S */, null],
  "i32.trunc_sat_f64_u": ["CONVERT" /* Convert */, 197 /* I32TruncSatF64U */, null],
  "i32": ["VALUETYPE" /* ValueType */, null, 0 /* I32 */],
  "i32.wrap_i64": ["CONVERT" /* Convert */, 157 /* I32WrapI64 */, null],
  "i32x4.abs": ["UNARY" /* Unary */, 368 /* I32X4Abs */, null],
  "i32x4.add": ["BINARY" /* Binary */, 379 /* I32X4Add */, null],
  "i32x4.all_true": ["UNARY" /* Unary */, 370 /* I32X4AllTrue */, null],
  "i32x4.bitmask": ["UNARY" /* Unary */, 371 /* I32X4Bitmask */, null],
  "i32x4.dot_i8x16_i7x16_add_s": ["TERNARY" /* Ternary */, 472 /* I32X4DotI8X16I7X16AddS */, null],
  "i32x4.eq": ["COMPARE" /* Compare */, 272 /* I32X4Eq */, null],
  "i32x4.extract_lane": ["SIMDLANEOP" /* SimdLaneOp */, 244 /* I32X4ExtractLane */, null],
  "i32x4.ge_s": ["COMPARE" /* Compare */, 280 /* I32X4GeS */, null],
  "i32x4.ge_u": ["COMPARE" /* Compare */, 281 /* I32X4GeU */, null],
  "i32x4.gt_s": ["COMPARE" /* Compare */, 276 /* I32X4GtS */, null],
  "i32x4.gt_u": ["COMPARE" /* Compare */, 277 /* I32X4GtU */, null],
  "i32x4.le_s": ["COMPARE" /* Compare */, 278 /* I32X4LeS */, null],
  "i32x4.le_u": ["COMPARE" /* Compare */, 279 /* I32X4LeU */, null],
  "i32x4.relaxed_trunc_f32x4_s": ["UNARY" /* Unary */, 454 /* I32X4RelaxedTruncF32X4S */, null],
  "i32x4.relaxed_trunc_f32x4_u": ["UNARY" /* Unary */, 455 /* I32X4RelaxedTruncF32X4U */, null],
  "i32x4.relaxed_trunc_f64x2_s_zero": ["UNARY" /* Unary */, 456 /* I32X4RelaxedTruncF64X2SZero */, null],
  "i32x4.relaxed_trunc_f64x2_u_zero": ["UNARY" /* Unary */, 457 /* I32X4RelaxedTruncF64X2UZero */, null],
  "v128.load16x4_s": ["LOAD" /* Load */, 220 /* V128Load16X4S */, null],
  "v128.load16x4_u": ["LOAD" /* Load */, 221 /* V128Load16X4U */, null],
  "i32x4.lt_s": ["COMPARE" /* Compare */, 274 /* I32X4LtS */, null],
  "i32x4.lt_u": ["COMPARE" /* Compare */, 275 /* I32X4LtU */, null],
  "i32x4.max_s": ["BINARY" /* Binary */, 384 /* I32X4MaxS */, null],
  "i32x4.max_u": ["BINARY" /* Binary */, 385 /* I32X4MaxU */, null],
  "i32x4.min_s": ["BINARY" /* Binary */, 382 /* I32X4MinS */, null],
  "i32x4.min_u": ["BINARY" /* Binary */, 383 /* I32X4MinU */, null],
  "i32x4.dot_i16x8_s": ["BINARY" /* Binary */, 386 /* I32X4DotI16X8S */, null],
  "i32x4.mul": ["BINARY" /* Binary */, 381 /* I32X4Mul */, null],
  "i32x4.neg": ["UNARY" /* Unary */, 369 /* I32X4Neg */, null],
  "i32x4.ne": ["COMPARE" /* Compare */, 273 /* I32X4Ne */, null],
  "i32x4.relaxed_laneselect": ["TERNARY" /* Ternary */, 464 /* I32X4RelaxedLaneSelect */, null],
  "i32x4.replace_lane": ["SIMDLANEOP" /* SimdLaneOp */, 245 /* I32X4ReplaceLane */, null],
  "i32x4.shl": ["BINARY" /* Binary */, 376 /* I32X4Shl */, null],
  "i32x4.shr_s": ["BINARY" /* Binary */, 377 /* I32X4ShrS */, null],
  "i32x4.shr_u": ["BINARY" /* Binary */, 378 /* I32X4ShrU */, null],
  "i32x4.splat": ["UNARY" /* Unary */, 234 /* I32X4Splat */, null],
  "i32x4.sub": ["BINARY" /* Binary */, 380 /* I32X4Sub */, null],
  "i32x4.extadd_pairwise_i16x8_s": ["UNARY" /* Unary */, 336 /* I32X4ExtaddPairwiseI16X8S */, null],
  "i32x4.extadd_pairwise_i16x8_u": ["UNARY" /* Unary */, 337 /* I32X4ExtaddPairwiseI16X8U */, null],
  "i32x4.extmul_low_i16x8_s": ["BINARY" /* Binary */, 387 /* I32X4ExtmulLowI16X8S */, null],
  "i32x4.extmul_high_i16x8_s": ["BINARY" /* Binary */, 388 /* I32X4ExtmulHighI16X8S */, null],
  "i32x4.extmul_low_i16x8_u": ["BINARY" /* Binary */, 389 /* I32X4ExtmulLowI16X8U */, null],
  "i32x4.extmul_high_i16x8_u": ["BINARY" /* Binary */, 390 /* I32X4ExtmulHighI16X8U */, null],
  "i32x4": ["i32x4" /* I32X4 */, null, null],
  "i32x4.trunc_sat_f32x4_s": ["UNARY" /* Unary */, 445 /* I32X4TruncSatF32X4S */, null],
  "i32x4.trunc_sat_f32x4_u": ["UNARY" /* Unary */, 446 /* I32X4TruncSatF32X4U */, null],
  "i32x4.extend_high_i16x8_s": ["UNARY" /* Unary */, 373 /* I32X4ExtendHighI16X8S */, null],
  "i32x4.extend_high_i16x8_u": ["UNARY" /* Unary */, 375 /* I32X4ExtendHighI16X8U */, null],
  "i32x4.extend_low_i16x8_s": ["UNARY" /* Unary */, 372 /* I32X4ExtendLowI16X8S */, null],
  "i32x4.extend_low_i16x8_u": ["UNARY" /* Unary */, 374 /* I32X4ExtendLowI16X8U */, null],
  "i32x4.trunc_sat_f64x2_s_zero": ["UNARY" /* Unary */, 449 /* I32X4TruncSatF64X2SZero */, null],
  "i32x4.trunc_sat_f64x2_u_zero": ["UNARY" /* Unary */, 450 /* I32X4TruncSatF64X2UZero */, null],
  "i32.xor": ["BINARY" /* Binary */, 105 /* I32Xor */, null],
  "i64.add": ["BINARY" /* Binary */, 114 /* I64Add */, null],
  "i64.and": ["BINARY" /* Binary */, 121 /* I64And */, null],
  "i64.atomic.load16_u": ["ATOMIC_LOAD" /* AtomicLoad */, 482 /* I64AtomicLoad16U */, null],
  "i64.atomic.load32_u": ["ATOMIC_LOAD" /* AtomicLoad */, 483 /* I64AtomicLoad32U */, null],
  "i64.atomic.load8_u": ["ATOMIC_LOAD" /* AtomicLoad */, 481 /* I64AtomicLoad8U */, null],
  "i64.atomic.load": ["ATOMIC_LOAD" /* AtomicLoad */, 478 /* I64AtomicLoad */, null],
  "i64.atomic.rmw16.add_u": ["ATOMIC_RMW" /* AtomicRmw */, 496 /* I64AtomicRmw16AddU */, null],
  "i64.atomic.rmw16.and_u": ["ATOMIC_RMW" /* AtomicRmw */, 510 /* I64AtomicRmw16AndU */, null],
  "i64.atomic.rmw16.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */, 538 /* I64AtomicRmw16CmpxchgU */, null],
  "i64.atomic.rmw16.or_u": ["ATOMIC_RMW" /* AtomicRmw */, 517 /* I64AtomicRmw16OrU */, null],
  "i64.atomic.rmw16.sub_u": ["ATOMIC_RMW" /* AtomicRmw */, 503 /* I64AtomicRmw16SubU */, null],
  "i64.atomic.rmw16.xchg_u": ["ATOMIC_RMW" /* AtomicRmw */, 531 /* I64AtomicRmw16XchgU */, null],
  "i64.atomic.rmw16.xor_u": ["ATOMIC_RMW" /* AtomicRmw */, 524 /* I64AtomicRmw16XorU */, null],
  "i64.atomic.rmw32.add_u": ["ATOMIC_RMW" /* AtomicRmw */, 497 /* I64AtomicRmw32AddU */, null],
  "i64.atomic.rmw32.and_u": ["ATOMIC_RMW" /* AtomicRmw */, 511 /* I64AtomicRmw32AndU */, null],
  "i64.atomic.rmw32.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */, 539 /* I64AtomicRmw32CmpxchgU */, null],
  "i64.atomic.rmw32.or_u": ["ATOMIC_RMW" /* AtomicRmw */, 518 /* I64AtomicRmw32OrU */, null],
  "i64.atomic.rmw32.sub_u": ["ATOMIC_RMW" /* AtomicRmw */, 504 /* I64AtomicRmw32SubU */, null],
  "i64.atomic.rmw32.xchg_u": ["ATOMIC_RMW" /* AtomicRmw */, 532 /* I64AtomicRmw32XchgU */, null],
  "i64.atomic.rmw32.xor_u": ["ATOMIC_RMW" /* AtomicRmw */, 525 /* I64AtomicRmw32XorU */, null],
  "i64.atomic.rmw8.add_u": ["ATOMIC_RMW" /* AtomicRmw */, 495 /* I64AtomicRmw8AddU */, null],
  "i64.atomic.rmw8.and_u": ["ATOMIC_RMW" /* AtomicRmw */, 509 /* I64AtomicRmw8AndU */, null],
  "i64.atomic.rmw8.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */, 537 /* I64AtomicRmw8CmpxchgU */, null],
  "i64.atomic.rmw8.or_u": ["ATOMIC_RMW" /* AtomicRmw */, 516 /* I64AtomicRmw8OrU */, null],
  "i64.atomic.rmw8.sub_u": ["ATOMIC_RMW" /* AtomicRmw */, 502 /* I64AtomicRmw8SubU */, null],
  "i64.atomic.rmw8.xchg_u": ["ATOMIC_RMW" /* AtomicRmw */, 530 /* I64AtomicRmw8XchgU */, null],
  "i64.atomic.rmw8.xor_u": ["ATOMIC_RMW" /* AtomicRmw */, 523 /* I64AtomicRmw8XorU */, null],
  "i64.atomic.rmw.add": ["ATOMIC_RMW" /* AtomicRmw */, 492 /* I64AtomicRmwAdd */, null],
  "i64.atomic.rmw.and": ["ATOMIC_RMW" /* AtomicRmw */, 506 /* I64AtomicRmwAnd */, null],
  "i64.atomic.rmw.cmpxchg": ["ATOMIC_RMW_CMPXCHG" /* AtomicRmwCmpxchg */, 534 /* I64AtomicRmwCmpxchg */, null],
  "i64.atomic.rmw.or": ["ATOMIC_RMW" /* AtomicRmw */, 513 /* I64AtomicRmwOr */, null],
  "i64.atomic.rmw.sub": ["ATOMIC_RMW" /* AtomicRmw */, 499 /* I64AtomicRmwSub */, null],
  "i64.atomic.rmw.xchg": ["ATOMIC_RMW" /* AtomicRmw */, 527 /* I64AtomicRmwXchg */, null],
  "i64.atomic.rmw.xor": ["ATOMIC_RMW" /* AtomicRmw */, 520 /* I64AtomicRmwXor */, null],
  "i64.atomic.store16": ["ATOMIC_STORE" /* AtomicStore */, 489 /* I64AtomicStore16 */, null],
  "i64.atomic.store32": ["ATOMIC_STORE" /* AtomicStore */, 490 /* I64AtomicStore32 */, null],
  "i64.atomic.store8": ["ATOMIC_STORE" /* AtomicStore */, 488 /* I64AtomicStore8 */, null],
  "i64.atomic.store": ["ATOMIC_STORE" /* AtomicStore */, 485 /* I64AtomicStore */, null],
  "i64.clz": ["UNARY" /* Unary */, 111 /* I64Clz */, null],
  "i64.const": ["CONST" /* Const */, 56 /* I64Const */, null],
  "i64.ctz": ["UNARY" /* Unary */, 112 /* I64Ctz */, null],
  "i64.div_s": ["BINARY" /* Binary */, 117 /* I64DivS */, null],
  "i64.div_u": ["BINARY" /* Binary */, 118 /* I64DivU */, null],
  "i64.eq": ["COMPARE" /* Compare */, 71 /* I64Eq */, null],
  "i64.eqz": ["CONVERT" /* Convert */, 70 /* I64Eqz */, null],
  "i64.extend16_s": ["UNARY" /* Unary */, 185 /* I64Extend16S */, null],
  "i64.extend32_s": ["UNARY" /* Unary */, 186 /* I64Extend32S */, null],
  "i64.extend8_s": ["UNARY" /* Unary */, 184 /* I64Extend8S */, null],
  "i64.extend_i32_s": ["CONVERT" /* Convert */, 162 /* I64ExtendI32S */, null],
  "i64.extend_i32_u": ["CONVERT" /* Convert */, 163 /* I64ExtendI32U */, null],
  "i64.ge_s": ["COMPARE" /* Compare */, 79 /* I64GeS */, null],
  "i64.ge_u": ["COMPARE" /* Compare */, 80 /* I64GeU */, null],
  "i64.gt_s": ["COMPARE" /* Compare */, 75 /* I64GtS */, null],
  "i64.gt_u": ["COMPARE" /* Compare */, 76 /* I64GtU */, null],
  "i64.le_s": ["COMPARE" /* Compare */, 77 /* I64LeS */, null],
  "i64.le_u": ["COMPARE" /* Compare */, 78 /* I64LeU */, null],
  "i64.load16_s": ["LOAD" /* Load */, 40 /* I64Load16S */, null],
  "i64.load16_u": ["LOAD" /* Load */, 41 /* I64Load16U */, null],
  "i64.load32_s": ["LOAD" /* Load */, 42 /* I64Load32S */, null],
  "i64.load32_u": ["LOAD" /* Load */, 43 /* I64Load32U */, null],
  "i64.load8_s": ["LOAD" /* Load */, 38 /* I64Load8S */, null],
  "i64.load8_u": ["LOAD" /* Load */, 39 /* I64Load8U */, null],
  "i64.load": ["LOAD" /* Load */, 31 /* I64Load */, null],
  "i64.lt_s": ["COMPARE" /* Compare */, 73 /* I64LtS */, null],
  "i64.lt_u": ["COMPARE" /* Compare */, 74 /* I64LtU */, null],
  "i64.mul": ["BINARY" /* Binary */, 116 /* I64Mul */, null],
  "i64.ne": ["COMPARE" /* Compare */, 72 /* I64Ne */, null],
  "i64.or": ["BINARY" /* Binary */, 122 /* I64Or */, null],
  "i64.popcnt": ["UNARY" /* Unary */, 113 /* I64Popcnt */, null],
  "i64.reinterpret_f64": ["CONVERT" /* Convert */, 179 /* I64ReinterpretF64 */, null],
  "i64.rem_s": ["BINARY" /* Binary */, 119 /* I64RemS */, null],
  "i64.rem_u": ["BINARY" /* Binary */, 120 /* I64RemU */, null],
  "i64.rotl": ["BINARY" /* Binary */, 127 /* I64Rotl */, null],
  "i64.rotr": ["BINARY" /* Binary */, 128 /* I64Rotr */, null],
  "i64.shl": ["BINARY" /* Binary */, 124 /* I64Shl */, null],
  "i64.shr_s": ["BINARY" /* Binary */, 125 /* I64ShrS */, null],
  "i64.shr_u": ["BINARY" /* Binary */, 126 /* I64ShrU */, null],
  "i64.store16": ["STORE" /* Store */, 51 /* I64Store16 */, null],
  "i64.store32": ["STORE" /* Store */, 52 /* I64Store32 */, null],
  "i64.store8": ["STORE" /* Store */, 50 /* I64Store8 */, null],
  "i64.store": ["STORE" /* Store */, 45 /* I64Store */, null],
  "i64.sub": ["BINARY" /* Binary */, 115 /* I64Sub */, null],
  "i64.trunc_f32_s": ["CONVERT" /* Convert */, 164 /* I64TruncF32S */, null],
  "i64.trunc_f32_u": ["CONVERT" /* Convert */, 165 /* I64TruncF32U */, null],
  "i64.trunc_f64_s": ["CONVERT" /* Convert */, 166 /* I64TruncF64S */, null],
  "i64.trunc_f64_u": ["CONVERT" /* Convert */, 167 /* I64TruncF64U */, null],
  "i64.trunc_sat_f32_s": ["CONVERT" /* Convert */, 198 /* I64TruncSatF32S */, null],
  "i64.trunc_sat_f32_u": ["CONVERT" /* Convert */, 199 /* I64TruncSatF32U */, null],
  "i64.trunc_sat_f64_s": ["CONVERT" /* Convert */, 200 /* I64TruncSatF64S */, null],
  "i64.trunc_sat_f64_u": ["CONVERT" /* Convert */, 201 /* I64TruncSatF64U */, null],
  "i64": ["VALUETYPE" /* ValueType */, null, 1 /* I64 */],
  "i64x2.add": ["BINARY" /* Binary */, 402 /* I64X2Add */, null],
  "i64x2.extract_lane": ["SIMDLANEOP" /* SimdLaneOp */, 246 /* I64X2ExtractLane */, null],
  "v128.load32x2_s": ["LOAD" /* Load */, 222 /* V128Load32X2S */, null],
  "v128.load32x2_u": ["LOAD" /* Load */, 223 /* V128Load32X2U */, null],
  "i64x2.mul": ["BINARY" /* Binary */, 404 /* I64X2Mul */, null],
  "i64x2.eq": ["BINARY" /* Binary */, 405 /* I64X2Eq */, null],
  "i64x2.ne": ["BINARY" /* Binary */, 406 /* I64X2Ne */, null],
  "i64x2.lt_s": ["BINARY" /* Binary */, 407 /* I64X2LtS */, null],
  "i64x2.gt_s": ["BINARY" /* Binary */, 408 /* I64X2GtS */, null],
  "i64x2.le_s": ["BINARY" /* Binary */, 409 /* I64X2LeS */, null],
  "i64x2.ge_s": ["BINARY" /* Binary */, 410 /* I64X2GeS */, null],
  "i64x2.abs": ["UNARY" /* Unary */, 391 /* I64X2Abs */, null],
  "i64x2.neg": ["UNARY" /* Unary */, 392 /* I64X2Neg */, null],
  "i64x2.all_true": ["UNARY" /* Unary */, 393 /* I64X2AllTrue */, null],
  "i64x2.bitmask": ["UNARY" /* Unary */, 394 /* I64X2Bitmask */, null],
  "i64x2.extend_low_i32x4_s": ["UNARY" /* Unary */, 395 /* I64X2ExtendLowI32X4S */, null],
  "i64x2.extend_high_i32x4_s": ["UNARY" /* Unary */, 396 /* I64X2ExtendHighI32X4S */, null],
  "i64x2.extend_low_i32x4_u": ["UNARY" /* Unary */, 397 /* I64X2ExtendLowI32X4U */, null],
  "i64x2.extend_high_i32x4_u": ["UNARY" /* Unary */, 398 /* I64X2ExtendHighI32X4U */, null],
  "i64x2.relaxed_laneselect": ["TERNARY" /* Ternary */, 465 /* I64X2RelaxedLaneSelect */, null],
  "i64x2.replace_lane": ["SIMDLANEOP" /* SimdLaneOp */, 247 /* I64X2ReplaceLane */, null],
  "i64x2.shl": ["BINARY" /* Binary */, 399 /* I64X2Shl */, null],
  "i64x2.shr_s": ["BINARY" /* Binary */, 400 /* I64X2ShrS */, null],
  "i64x2.shr_u": ["BINARY" /* Binary */, 401 /* I64X2ShrU */, null],
  "i64x2.splat": ["UNARY" /* Unary */, 235 /* I64X2Splat */, null],
  "i64x2.sub": ["BINARY" /* Binary */, 403 /* I64X2Sub */, null],
  "i64x2.extmul_low_i32x4_s": ["BINARY" /* Binary */, 411 /* I64X2ExtmulLowI32X4S */, null],
  "i64x2.extmul_high_i32x4_s": ["BINARY" /* Binary */, 412 /* I64X2ExtmulHighI32X4S */, null],
  "i64x2.extmul_low_i32x4_u": ["BINARY" /* Binary */, 413 /* I64X2ExtmulLowI32X4U */, null],
  "i64x2.extmul_high_i32x4_u": ["BINARY" /* Binary */, 414 /* I64X2ExtmulHighI32X4U */, null],
  "i64x2": ["i64x2" /* I64X2 */, null, null],
  "i64.xor": ["BINARY" /* Binary */, 123 /* I64Xor */, null],
  "i8x16.abs": ["UNARY" /* Unary */, 313 /* I8X16Abs */, null],
  "i8x16.add_sat_s": ["BINARY" /* Binary */, 324 /* I8X16AddSatS */, null],
  "i8x16.add_sat_u": ["BINARY" /* Binary */, 325 /* I8X16AddSatU */, null],
  "i8x16.add": ["BINARY" /* Binary */, 323 /* I8X16Add */, null],
  "i8x16.all_true": ["UNARY" /* Unary */, 316 /* I8X16AllTrue */, null],
  "i8x16.avgr_u": ["BINARY" /* Binary */, 333 /* I8X16AvgrU */, null],
  "i8x16.bitmask": ["UNARY" /* Unary */, 317 /* I8X16Bitmask */, null],
  "i8x16.eq": ["COMPARE" /* Compare */, 252 /* I8X16Eq */, null],
  "i8x16.extract_lane_s": ["SIMDLANEOP" /* SimdLaneOp */, 238 /* I8X16ExtractLaneS */, null],
  "i8x16.extract_lane_u": ["SIMDLANEOP" /* SimdLaneOp */, 239 /* I8X16ExtractLaneU */, null],
  "i8x16.ge_s": ["COMPARE" /* Compare */, 260 /* I8X16GeS */, null],
  "i8x16.ge_u": ["COMPARE" /* Compare */, 261 /* I8X16GeU */, null],
  "i8x16.gt_s": ["COMPARE" /* Compare */, 256 /* I8X16GtS */, null],
  "i8x16.gt_u": ["COMPARE" /* Compare */, 257 /* I8X16GtU */, null],
  "i8x16.le_s": ["COMPARE" /* Compare */, 258 /* I8X16LeS */, null],
  "i8x16.le_u": ["COMPARE" /* Compare */, 259 /* I8X16LeU */, null],
  "i8x16.lt_s": ["COMPARE" /* Compare */, 254 /* I8X16LtS */, null],
  "i8x16.lt_u": ["COMPARE" /* Compare */, 255 /* I8X16LtU */, null],
  "i8x16.max_s": ["BINARY" /* Binary */, 331 /* I8X16MaxS */, null],
  "i8x16.max_u": ["BINARY" /* Binary */, 332 /* I8X16MaxU */, null],
  "i8x16.min_s": ["BINARY" /* Binary */, 329 /* I8X16MinS */, null],
  "i8x16.min_u": ["BINARY" /* Binary */, 330 /* I8X16MinU */, null],
  "i8x16.narrow_i16x8_s": ["BINARY" /* Binary */, 318 /* I8X16NarrowI16X8S */, null],
  "i8x16.narrow_i16x8_u": ["BINARY" /* Binary */, 319 /* I8X16NarrowI16X8U */, null],
  "i8x16.neg": ["UNARY" /* Unary */, 314 /* I8X16Neg */, null],
  "i8x16.popcnt": ["UNARY" /* Unary */, 315 /* I8X16Popcnt */, null],
  "i8x16.ne": ["COMPARE" /* Compare */, 253 /* I8X16Ne */, null],
  "i8x16.relaxed_swizzle": ["BINARY" /* Binary */, 453 /* I8X16RelaxedSwizzle */, null],
  "i8x16.relaxed_laneselect": ["TERNARY" /* Ternary */, 462 /* I8X16RelaxedLaneSelect */, null],
  "i8x16.replace_lane": ["SIMDLANEOP" /* SimdLaneOp */, 240 /* I8X16ReplaceLane */, null],
  "i8x16.shl": ["BINARY" /* Binary */, 320 /* I8X16Shl */, null],
  "i8x16.shr_s": ["BINARY" /* Binary */, 321 /* I8X16ShrS */, null],
  "i8x16.shr_u": ["BINARY" /* Binary */, 322 /* I8X16ShrU */, null],
  "i8x16.splat": ["UNARY" /* Unary */, 232 /* I8X16Splat */, null],
  "i8x16.sub_sat_s": ["BINARY" /* Binary */, 327 /* I8X16SubSatS */, null],
  "i8x16.sub_sat_u": ["BINARY" /* Binary */, 328 /* I8X16SubSatU */, null],
  "i8x16.sub": ["BINARY" /* Binary */, 326 /* I8X16Sub */, null],
  "i8x16": ["i8x16" /* I8X16 */, null, null],
  "if": ["if" /* If */, 4 /* If */, null],
  "import": ["import" /* Import */, null, null],
  "input": ["input" /* Input */, null, null],
  "invoke": ["invoke" /* Invoke */, null, null],
  "item": ["item" /* Item */, null, null],
  "local.get": ["local.get" /* LocalGet */, 25 /* LocalGet */, null],
  "local.set": ["local.set" /* LocalSet */, 26 /* LocalSet */, null],
  "local.tee": ["local.tee" /* LocalTee */, 27 /* LocalTee */, null],
  "local": ["local" /* Local */, null, null],
  "loop": ["loop" /* Loop */, 3 /* Loop */, null],
  "memory.atomic.notify": ["ATOMIC_NOTIFY" /* AtomicNotify */, 473 /* MemoryAtomicNotify */, null],
  "memory.atomic.wait32": ["ATOMIC_WAIT" /* AtomicWait */, 474 /* MemoryAtomicWait32 */, null],
  "memory.atomic.wait64": ["ATOMIC_WAIT" /* AtomicWait */, 475 /* MemoryAtomicWait64 */, null],
  "memory.copy": ["memory.copy" /* MemoryCopy */, 204 /* MemoryCopy */, null],
  "memory.fill": ["memory.fill" /* MemoryFill */, 205 /* MemoryFill */, null],
  "memory.grow": ["memory.grow" /* MemoryGrow */, 54 /* MemoryGrow */, null],
  "memory.init": ["memory.init" /* MemoryInit */, 202 /* MemoryInit */, null],
  "memory.size": ["memory.size" /* MemorySize */, 53 /* MemorySize */, null],
  "memory": ["memory" /* Memory */, null, null],
  "module": ["module" /* Module */, null, null],
  "mut": ["mut" /* Mut */, null, null],
  "nan:arithmetic": ["nan:arithmetic" /* NanArithmetic */, null, null],
  "nan:canonical": ["nan:canonical" /* NanCanonical */, null, null],
  "nop": ["nop" /* Nop */, 1 /* Nop */, null],
  "offset": ["offset" /* Offset */, null, null],
  "output": ["output" /* Output */, null, null],
  "param": ["param" /* Param */, null, null],
  "ref": ["ref" /* Ref */, null, null],
  "quote": ["quote" /* Quote */, null, null],
  "ref.extern": ["ref.extern" /* RefExtern */, null, null],
  "ref.func": ["ref.func" /* RefFunc */, 216 /* RefFunc */, null],
  "ref.is_null": ["ref.is_null" /* RefIsNull */, 215 /* RefIsNull */, null],
  "ref.null": ["ref.null" /* RefNull */, 214 /* RefNull */, null],
  "register": ["register" /* Register */, null, null],
  "result": ["result" /* Result */, null, null],
  "rethrow": ["rethrow" /* Rethrow */, 9 /* Rethrow */, null],
  "return_call_indirect": ["return_call_indirect" /* ReturnCallIndirect */, 18 /* ReturnCallIndirect */, null],
  "return_call": ["return_call" /* ReturnCall */, 17 /* ReturnCall */, null],
  "return": ["return" /* Return */, 14 /* Return */, null],
  "select": ["select" /* Select */, 23 /* Select */, null],
  "shared": ["shared" /* Shared */, null, null],
  "start": ["start" /* Start */, null, null],
  "struct": ["struct" /* Struct */, null, 11 /* Struct */],
  "table.copy": ["table.copy" /* TableCopy */, 208 /* TableCopy */, null],
  "table.fill": ["table.full" /* TableFill */, 213 /* TableFill */, null],
  "table.get": ["table.get" /* TableGet */, 209 /* TableGet */, null],
  "table.grow": ["table.grow" /* TableGrow */, 211 /* TableGrow */, null],
  "table.init": ["table.init" /* TableInit */, 206 /* TableInit */, null],
  "table.set": ["table.set" /* TableSet */, 210 /* TableSet */, null],
  "table.size": ["table.size" /* TableSize */, 212 /* TableSize */, null],
  "table": ["table" /* Table */, null, null],
  "then": ["then" /* Then */, null, null],
  "throw": ["throw" /* Throw */, 8 /* Throw */, null],
  "try": ["try" /* Try */, 6 /* Try */, null],
  "type": ["type" /* Type */, null, null],
  "unreachable": ["unreachable" /* Unreachable */, 0 /* Unreachable */, null],
  "v128.andnot": ["BINARY" /* Binary */, 296 /* V128Andnot */, null],
  "v128.and": ["BINARY" /* Binary */, 295 /* V128And */, null],
  "v128.bitselect": ["TERNARY" /* Ternary */, 299 /* V128BitSelect */, null],
  "v128.const": ["CONST" /* Const */, 229 /* V128Const */, null],
  "v128.load": ["LOAD" /* Load */, 217 /* V128Load */, null],
  "v128.not": ["UNARY" /* Unary */, 294 /* V128Not */, null],
  "v128.or": ["BINARY" /* Binary */, 297 /* V128Or */, null],
  "v128.any_true": ["UNARY" /* Unary */, 300 /* V128AnyTrue */, null],
  "v128.load32_zero": ["LOAD" /* Load */, 309 /* V128Load32Zero */, null],
  "v128.load64_zero": ["LOAD" /* Load */, 310 /* V128Load64Zero */, null],
  "v128.store": ["STORE" /* Store */, 228 /* V128Store */, null],
  "v128": ["VALUETYPE" /* ValueType */, null, 4 /* V128 */],
  "v128.xor": ["BINARY" /* Binary */, 298 /* V128Xor */, null],
  "v128.load16_splat": ["LOAD" /* Load */, 225 /* V128Load16Splat */, null],
  "v128.load32_splat": ["LOAD" /* Load */, 226 /* V128Load32Splat */, null],
  "v128.load64_splat": ["LOAD" /* Load */, 227 /* V128Load64Splat */, null],
  "v128.load8_splat": ["LOAD" /* Load */, 224 /* V128Load8Splat */, null],
  "v128.load8_lane": ["SIMDLOADLANE" /* SimdLoadLane */, 301 /* V128Load8Lane */, null],
  "v128.load16_lane": ["SIMDLOADLANE" /* SimdLoadLane */, 302 /* V128Load16Lane */, null],
  "v128.load32_lane": ["SIMDLOADLANE" /* SimdLoadLane */, 303 /* V128Load32Lane */, null],
  "v128.load64_lane": ["SIMDLOADLANE" /* SimdLoadLane */, 304 /* V128Load64Lane */, null],
  "v128.store8_lane": ["SIMDSTORELANE" /* SimdStoreLane */, 305 /* V128Store8Lane */, null],
  "v128.store16_lane": ["SIMDSTORELANE" /* SimdStoreLane */, 306 /* V128Store16Lane */, null],
  "v128.store32_lane": ["SIMDSTORELANE" /* SimdStoreLane */, 307 /* V128Store32Lane */, null],
  "v128.store64_lane": ["SIMDSTORELANE" /* SimdStoreLane */, 308 /* V128Store64Lane */, null],
  "i8x16.shuffle": ["i8x16.shuffle" /* SimdShuffleOp */, 230 /* I8X16Shuffle */, null],
  "i8x16.swizzle": ["BINARY" /* Binary */, 231 /* I8X16Swizzle */, null]
};
function isKeyWord(str) {
  return str in wordlist;
}
function getType(str) {
  return wordlist[str][2];
}
function getTokenType(str) {
  return wordlist[str][0];
}
function getOpcodeType(str) {
  return wordlist[str][1];
}

// src/lexer/lexer.ts
var kEof = "\0";
function tokenize(program) {
  return new Lexer(program).getAllTokens();
}
function getSingleToken(token) {
  return new Lexer(token).getToken();
}
function isDigit(c) {
  (0, import_assert4.default)(c.length === 1);
  return /[0-9]/u.test(c);
}
function isHexDigit(c) {
  (0, import_assert4.default)(c.length === 1);
  return /[0-9a-f]/iu.test(c);
}
function isKeyword(c) {
  (0, import_assert4.default)(c.length === 1);
  return /[a-z]/u.test(c);
}
function isIdChar(c) {
  (0, import_assert4.default)(c.length === 1);
  return /[!-~]/u.test(c) && /[^"(),;=[\]{}]/u.test(c);
}
var Lexer = class {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.cursor = 0;
    this.line = 0;
    this.col = 0;
    this.token_start = 0;
  }
  getAllTokens() {
    let tokens = [];
    while (true) {
      const token = this.getToken();
      if (token.type === "EOF" /* Eof */)
        break;
      tokens.push(token);
    }
    return tokens;
  }
  // eslint-disable-next-line complexity
  getToken() {
    while (true) {
      this.token_start = this.cursor;
      switch (this.peekChar()) {
        case kEof:
          return this.bareToken("EOF" /* Eof */);
        case "(":
          if (this.matchString("(;")) {
            if (this.readBlockComment()) {
              continue;
            }
            return this.bareToken("EOF" /* Eof */);
          }
          if (this.matchString("(@")) {
            this.getIdToken();
            return this.textToken("Annotation" /* LparAnn */, 2);
          }
          this.readChar();
          return this.bareToken("(" /* Lpar */);
          break;
        case ")":
          this.readChar();
          return this.bareToken(")" /* Rpar */);
        case ";":
          if (this.matchString(";;")) {
            if (this.readLineComment()) {
              continue;
            }
            return this.bareToken("EOF" /* Eof */);
          }
          this.readChar();
          throw new Error("unexpected char");
          continue;
          break;
        case " ":
        case "	":
        case "\r":
        case "\n":
          this.readWhitespace();
          continue;
        case '"':
          return this.getStringToken();
        case "+":
        case "-":
          this.readChar();
          switch (this.peekChar()) {
            case "i":
              return this.getInfToken();
            case "n":
              return this.getNanToken();
            case "0":
              return this.matchString("0x") ? this.getHexNumberToken("INT" /* Int */) : this.getNumberToken("INT" /* Int */);
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              return this.getNumberToken("INT" /* Int */);
            default:
              return this.getReservedToken();
          }
          break;
        case "0":
          return this.matchString("0x") ? this.getHexNumberToken("NAT" /* Nat */) : this.getNumberToken("NAT" /* Nat */);
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          return this.getNumberToken("NAT" /* Nat */);
        case "$":
          return this.getIdToken();
        case "a":
          return this.getNameEqNumToken("align=", "align=" /* AlignEqNat */);
        case "i":
          return this.getInfToken();
        case "n":
          return this.getNanToken();
        case "o":
          return this.getNameEqNumToken("offset=", "offset=" /* OffsetEqNat */);
        default:
          if (isKeyword(this.peekChar())) {
            return this.getKeywordToken();
          }
          if (isIdChar(this.peekChar())) {
            return this.getReservedToken();
          }
          this.readChar();
          throw new Error("unexpected char");
          continue;
      }
    }
  }
  peekChar() {
    return this.cursor < this.source.length ? this.source[this.cursor] : kEof;
  }
  readChar() {
    return this.cursor < this.source.length ? this.source[this.cursor++] : kEof;
  }
  matchChar(c) {
    (0, import_assert4.default)(c.length === 1);
    if (this.peekChar() === c) {
      this.readChar();
      return true;
    }
    return false;
  }
  matchString(s) {
    const saved_cursor = this.cursor;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (this.readChar() !== c) {
        this.cursor = saved_cursor;
        return false;
      }
    }
    return true;
  }
  newline() {
    this.line++;
    this.cursor++;
    this.col = 0;
  }
  noTrailingReservedChars() {
    return this.readReservedChars() === 0 /* None */;
  }
  readReservedChars() {
    let ret = 0 /* None */;
    while (true) {
      let peek = this.peekChar();
      if (isIdChar(peek)) {
        this.readChar();
        if (ret === 0 /* None */) {
          ret = 2 /* Id */;
        }
      } else if (peek === '"') {
        this.getStringToken();
        ret = 1 /* Some */;
      } else {
        break;
      }
    }
    return ret;
  }
  readBlockComment() {
    let nesting = 1;
    while (true) {
      switch (this.readChar()) {
        case kEof:
          throw new Error("EOF in block comment");
          return false;
        case ";":
          if (this.matchChar(")") && --nesting === 0) {
            return true;
          }
          break;
        case "(":
          if (this.matchChar(";")) {
            nesting++;
          }
          break;
        case "\n":
          this.newline();
          break;
      }
    }
  }
  readLineComment() {
    while (true) {
      switch (this.readChar()) {
        case kEof:
          return false;
        case "\n":
          this.newline();
          return true;
      }
    }
  }
  readWhitespace() {
    while (true) {
      switch (this.peekChar()) {
        case " ":
        case "	":
        case "\r":
          this.readChar();
          break;
        case "\n":
          this.readChar();
          this.newline();
          break;
        default:
          return;
      }
    }
  }
  readSign() {
    if (this.peekChar() === "+" || this.peekChar() === "-") {
      this.readChar();
    }
  }
  readNum() {
    if (isDigit(this.peekChar())) {
      this.readChar();
      return this.matchChar("_") || isDigit(this.peekChar()) ? this.readNum() : true;
    }
    return false;
  }
  readHexNum() {
    if (isHexDigit(this.peekChar())) {
      this.readChar();
      return this.matchChar("_") || isHexDigit(this.peekChar()) ? this.readHexNum() : true;
    }
    return false;
  }
  bareToken(token_type) {
    return new Token(token_type, this.getText(), this.line, this.col, this.cursor);
  }
  // TODO: need to do something with literal_type
  literalToken(token_type, literal_type) {
    return new Token(
      token_type,
      this.getText(),
      this.line,
      this.col,
      this.cursor
    );
  }
  textToken(token_type, offset = 0) {
    return new Token(
      token_type,
      this.getText(offset),
      this.line,
      this.col,
      this.cursor
    );
  }
  getText(offset = 0) {
    return this.source.slice(this.token_start + offset, this.cursor);
  }
  getReservedToken() {
    this.readReservedChars();
    (0, import_assert4.default)(false);
    return this.textToken("Reserved" /* Reserved */);
  }
  // eslint-disable-next-line complexity
  getStringToken() {
    const saved_token_start = this.token_start;
    let has_error = false;
    let in_string = true;
    this.readChar();
    while (in_string) {
      switch (this.readChar()) {
        case kEof:
          return this.bareToken("EOF" /* Eof */);
        case "\n":
          this.token_start = this.cursor - 1;
          throw new Error("newline in string");
          has_error = true;
          this.newline();
          continue;
        case '"':
          if (this.peekChar() === '"') {
            throw new Error("invalid string token");
            has_error = true;
          }
          in_string = false;
          break;
        case "\\": {
          switch (this.readChar()) {
            case "t":
            case "n":
            case "r":
            case '"':
            case "'":
            case "\\":
              break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "a":
            case "b":
            case "c":
            case "d":
            case "e":
            case "f":
            case "A":
            case "B":
            case "C":
            case "D":
            case "E":
            case "F":
              if (isHexDigit(this.peekChar())) {
                this.readChar();
              } else {
                this.token_start = this.cursor - 2;
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }
              break;
            case "u": {
              this.token_start = this.cursor - 2;
              if (this.readChar() !== "{") {
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }
              let digit;
              let scalar_value = 0;
              while (isHexDigit(this.peekChar())) {
                digit = parseHexdigit(this.source[this.cursor++]);
                scalar_value = scalar_value << 4 | digit;
                if (scalar_value >= 1114112) {
                  throw new Error(`bad escape "%.*s"${this.getText}`);
                  has_error = true;
                }
              }
              if (this.peekChar() !== "}") {
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }
              if (scalar_value >= 55296 && scalar_value < 57344 || this.token_start === this.cursor - 3) {
                this.readChar();
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }
              break;
            }
            default:
              this.token_start = this.cursor - 2;
              throw new Error(`bad escape "%.*s"${this.getText}`);
              has_error = true;
          }
          break;
        }
      }
    }
    this.token_start = saved_token_start;
    if (has_error) {
      return new Token(
        "Invalid" /* Invalid */,
        this.getText(),
        this.line,
        this.col,
        this.cursor
      );
    }
    return this.textToken("TEXT" /* Text */);
  }
  getNumberToken(token_type) {
    if (this.readNum()) {
      if (this.matchChar(".")) {
        token_type = "FLOAT" /* Float */;
        if (isDigit(this.peekChar()) && !this.readNum()) {
          return this.getReservedToken();
        }
      }
      if (this.matchChar("e") || this.matchChar("E")) {
        token_type = "FLOAT" /* Float */;
        this.readSign();
        if (!this.readNum()) {
          return this.getReservedToken();
        }
      }
      if (this.noTrailingReservedChars()) {
        if (token_type === "FLOAT" /* Float */) {
          return this.literalToken(token_type, 1 /* Float */);
        }
        return this.literalToken(token_type, 0 /* Int */);
      }
    }
    return this.getReservedToken();
  }
  getHexNumberToken(token_type) {
    if (this.readHexNum()) {
      if (this.matchChar(".")) {
        token_type = "FLOAT" /* Float */;
        if (isHexDigit(this.peekChar()) && !this.readHexNum()) {
          return this.getReservedToken();
        }
      }
      if (this.matchChar("p") || this.matchChar("P")) {
        token_type = "FLOAT" /* Float */;
        this.readSign();
        if (!this.readNum()) {
          return this.getReservedToken();
        }
      }
      if (this.noTrailingReservedChars()) {
        if (token_type === "FLOAT" /* Float */) {
          return this.literalToken(token_type, 2 /* Hexfloat */);
        }
        return this.literalToken(token_type, 0 /* Int */);
      }
    }
    return this.getReservedToken();
  }
  getInfToken() {
    if (this.matchString("inf")) {
      if (this.noTrailingReservedChars()) {
        return this.literalToken("FLOAT" /* Float */, 3 /* Infinity */);
      }
      return this.getReservedToken();
    }
    return this.getKeywordToken();
  }
  getNanToken() {
    if (this.matchString("nan")) {
      if (this.matchChar(":")) {
        if (this.matchString("0x") && this.readHexNum() && this.noTrailingReservedChars()) {
          return this.literalToken("FLOAT" /* Float */, 4 /* Nan */);
        }
      } else if (this.noTrailingReservedChars()) {
        return this.literalToken("FLOAT" /* Float */, 4 /* Nan */);
      }
    }
    return this.getKeywordToken();
  }
  getNameEqNumToken(name, token_type) {
    if (this.matchString(name)) {
      if (this.matchString("0x")) {
        if (this.readHexNum() && this.noTrailingReservedChars()) {
          return this.textToken(token_type, name.length);
        }
      } else if (this.readNum() && this.noTrailingReservedChars()) {
        return this.textToken(token_type, name.length);
      }
    }
    return this.getKeywordToken();
  }
  getIdToken() {
    this.readChar();
    if (this.readReservedChars() === 2 /* Id */) {
      return this.textToken("VAR" /* Var */);
    }
    return this.textToken("Reserved" /* Reserved */);
  }
  getKeywordToken() {
    this.readReservedChars();
    const text = this.getText();
    if (!isKeyWord(text)) {
      return this.textToken("Reserved" /* Reserved */);
    }
    const tokenType = getTokenType(text);
    const valueType = getType(text);
    const opcodeType = getOpcodeType(text);
    if (isTokenTypeBare(tokenType)) {
      return this.bareToken(tokenType);
    }
    if (isTokenTypeType(tokenType) || isTokenTypeRefKind(tokenType)) {
      return new Token(tokenType, text, this.line, this.col, this.cursor, null, valueType);
    }
    (0, import_assert4.default)(isTokenTypeOpcode(tokenType));
    return new Token(tokenType, text, this.line, this.col, this.cursor, opcodeType);
  }
};

// src/parser/parser.ts
var import_assert5 = __toESM(require("assert"));
function getIntermediateRepresentation(tokenTree) {
  if (isSExpression(tokenTree) || isStackExpression(tokenTree)) {
    return parseExpression(tokenTree);
  }
  if (isFunctionExpression(tokenTree)) {
    return parseFunctionExpression(tokenTree);
  }
  if (isModuleDeclaration(tokenTree)) {
    return parseModuleExpression(tokenTree);
  }
  if (isExportDeclaration(tokenTree)) {
    return parseExportDeclaration(tokenTree);
  }
  throw new Error(
    `Unexpected token type to parse: ${JSON.stringify(tokenTree, void 0, 2)}`
  );
}
function parseExpression(tokenTree) {
  if (isSExpression(tokenTree)) {
    return parseSExpression(tokenTree);
  }
  if (isStackExpression(tokenTree)) {
    return parseStackExpression(tokenTree);
  }
  throw new Error(`Cannot parse into function expression: ${JSON.stringify(tokenTree, void 0, 2)}`);
}
function parseSExpression(tokenTree) {
  const head = tokenTree[0];
  (0, import_assert5.default)(head instanceof Token);
  const body = [];
  for (let i = 1; i < tokenTree.length; i++) {
    const token = tokenTree[i];
    if (token instanceof Token) {
      body.push(token);
    } else {
      const irNode = getIntermediateRepresentation(token);
      (0, import_assert5.default)(irNode instanceof Token || irNode instanceof OperationTree || irNode instanceof UnfoldedTokenExpression);
      body.push(irNode);
    }
  }
  (0, import_assert5.default)(Opcode.getParamLength(head.opcodeType) === body.length);
  return new OperationTree(head, body);
}
function parseStackExpression(tokenTree) {
  const nodes = [];
  tokenTree.forEach((tokenNode) => {
    if (tokenNode instanceof Token) {
      nodes.push(tokenNode);
    } else {
      const temp = getIntermediateRepresentation(tokenNode);
      (0, import_assert5.default)(temp instanceof Token || temp instanceof OperationTree);
      nodes.push(temp);
    }
  });
  return new UnfoldedTokenExpression(nodes);
}
function parseFunctionExpression(tokenTree) {
  (0, import_assert5.default)(isFunctionExpression(tokenTree));
  const paramTypes = [];
  const paramNames = [];
  const resultTypes = [];
  const parseParam = (tokenTree2) => {
    for (let i = 1; i < tokenTree2.length; i++) {
      const tokenTreeNode = tokenTree2[i];
      (0, import_assert5.default)(tokenTreeNode instanceof Token);
      if (tokenTreeNode.type === "VALUETYPE" /* ValueType */) {
        paramTypes.push(tokenTreeNode.valueType);
      } else if (tokenTreeNode.type === "VAR" /* Var */) {
        paramNames.push(tokenTreeNode.lexeme);
      } else {
        throw new Error(`Unexpected token, bla bla ${tokenTreeNode}`);
      }
    }
  };
  const parseResult = (tokenTree2) => {
    for (let i = 1; i < tokenTree2.length; i++) {
      const tokenTreeNode = tokenTree2[i];
      (0, import_assert5.default)(tokenTreeNode instanceof Token);
      if (tokenTreeNode.type === "VALUETYPE" /* ValueType */) {
        resultTypes.push(tokenTreeNode.valueType);
      } else {
        throw new Error(`Unexpected token, bla bla ${tokenTreeNode}`);
      }
    }
  };
  let cursor;
  for (cursor = 1; cursor < tokenTree.length; cursor++) {
    const tokenTreeNode = tokenTree[cursor];
    if (tokenTreeNode instanceof Token) {
      break;
    }
    if (isFunctionParamDeclaration(tokenTreeNode)) {
      parseParam(tokenTreeNode);
    } else if (isFunctionResultDeclaration(tokenTreeNode)) {
      parseResult(tokenTreeNode);
    } else {
      break;
    }
  }
  let remainingTree = tokenTree.slice(cursor);
  if (remainingTree.length === 1 && !(remainingTree[0] instanceof Token)) {
    remainingTree = remainingTree[0];
  }
  const ir = parseExpression(remainingTree);
  return new FunctionExpression(paramTypes, resultTypes, paramNames, ir);
}
function parseModuleExpression(tokenTree) {
  (0, import_assert5.default)(isModuleDeclaration(tokenTree));
  const functionExps = [];
  const exportExps = [];
  for (let i = 1; i < tokenTree.length; i++) {
    const tokenTreeNode = tokenTree[i];
    (0, import_assert5.default)(!(tokenTreeNode instanceof Token));
    if (isFunctionExpression(tokenTreeNode)) {
      functionExps.push(parseFunctionExpression(tokenTreeNode));
    }
    if (isExportDeclaration(tokenTreeNode)) {
      exportExps.push(parseExportDeclaration(tokenTreeNode));
    }
  }
  return new ModuleExpression(functionExps, exportExps[0]);
}
function parseExportDeclaration(tokenTree) {
  (0, import_assert5.default)(isExportDeclaration(tokenTree));
  const exportObjects = [];
  for (let i = 1; i < tokenTree.length; i += 2) {
    const exportName = tokenTree[i];
    (0, import_assert5.default)(exportName instanceof Token);
    const exportInfo = tokenTree[i + 1];
    (0, import_assert5.default)(exportInfo instanceof Array);
    const [exportType, exportIndex] = exportInfo;
    (0, import_assert5.default)(exportType instanceof Token && exportIndex instanceof Token);
    exportObjects.push(new ExportObject(exportName, exportType, exportIndex));
  }
  return new ExportExpression(exportObjects);
}
function isSExpression(tokenTree) {
  const tokenHeader = tokenTree[0];
  (0, import_assert5.default)(tokenHeader instanceof Token);
  return tokenHeader instanceof Token && tokenHeader.isOpcodeToken() && Opcode.getParamLength(tokenHeader.opcodeType) > 0;
}
function isStackExpression(tokenTree) {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.isOpcodeToken() && !isFunctionExpression(tokenTree) && !isSExpression(tokenTree);
}
function isFunctionExpression(tokenTree) {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === "func" /* Func */;
}
function isFunctionParamDeclaration(tokenTree) {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === "param" /* Param */;
}
function isFunctionResultDeclaration(tokenTree) {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === "result" /* Result */;
}
function isModuleDeclaration(tokenTree) {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === "module" /* Module */;
}
function isExportDeclaration(tokenTree) {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === "export" /* Export */;
}

// node_modules/reflect-metadata/Reflect.js
var Reflect2;
(function(Reflect3) {
  (function(factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : Function("return this;")();
    var exporter = makeExporter(Reflect3);
    if (typeof root.Reflect === "undefined") {
      root.Reflect = Reflect3;
    } else {
      exporter = makeExporter(root.Reflect, exporter);
    }
    factory(exporter);
    function makeExporter(target, previous) {
      return function(key, value) {
        if (typeof target[key] !== "function") {
          Object.defineProperty(target, key, { configurable: true, writable: true, value });
        }
        if (previous)
          previous(key, value);
      };
    }
  })(function(exporter) {
    var hasOwn = Object.prototype.hasOwnProperty;
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var supportsCreate = typeof Object.create === "function";
    var supportsProto = { __proto__: [] } instanceof Array;
    var downLevel = !supportsCreate && !supportsProto;
    var HashMap = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: supportsCreate ? function() {
        return MakeDictionary(/* @__PURE__ */ Object.create(null));
      } : supportsProto ? function() {
        return MakeDictionary({ __proto__: null });
      } : function() {
        return MakeDictionary({});
      },
      has: downLevel ? function(map, key) {
        return hasOwn.call(map, key);
      } : function(map, key) {
        return key in map;
      },
      get: downLevel ? function(map, key) {
        return hasOwn.call(map, key) ? map[key] : void 0;
      } : function(map, key) {
        return map[key];
      }
    };
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    var Metadata = new _WeakMap();
    function decorate(decorators, target, propertyKey, attributes) {
      if (!IsUndefined(propertyKey)) {
        if (!IsArray(decorators))
          throw new TypeError();
        if (!IsObject(target))
          throw new TypeError();
        if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
          throw new TypeError();
        if (IsNull(attributes))
          attributes = void 0;
        propertyKey = ToPropertyKey(propertyKey);
        return DecorateProperty(decorators, target, propertyKey, attributes);
      } else {
        if (!IsArray(decorators))
          throw new TypeError();
        if (!IsConstructor(target))
          throw new TypeError();
        return DecorateConstructor(decorators, target);
      }
    }
    exporter("decorate", decorate);
    function metadata(metadataKey, metadataValue) {
      function decorator(target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
          throw new TypeError();
        OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
      }
      return decorator;
    }
    exporter("metadata", metadata);
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    exporter("defineMetadata", defineMetadata);
    function hasMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    exporter("hasMetadata", hasMetadata);
    function hasOwnMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    exporter("hasOwnMetadata", hasOwnMetadata);
    function getMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    exporter("getMetadata", getMetadata);
    function getOwnMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    exporter("getOwnMetadata", getOwnMetadata);
    function getMetadataKeys(target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryMetadataKeys(target, propertyKey);
    }
    exporter("getMetadataKeys", getMetadataKeys);
    function getOwnMetadataKeys(target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    exporter("getOwnMetadataKeys", getOwnMetadataKeys);
    function deleteMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target))
        throw new TypeError();
      if (!IsUndefined(propertyKey))
        propertyKey = ToPropertyKey(propertyKey);
      var metadataMap = GetOrCreateMetadataMap(
        target,
        propertyKey,
        /*Create*/
        false
      );
      if (IsUndefined(metadataMap))
        return false;
      if (!metadataMap.delete(metadataKey))
        return false;
      if (metadataMap.size > 0)
        return true;
      var targetMetadata = Metadata.get(target);
      targetMetadata.delete(propertyKey);
      if (targetMetadata.size > 0)
        return true;
      Metadata.delete(target);
      return true;
    }
    exporter("deleteMetadata", deleteMetadata);
    function DecorateConstructor(decorators, target) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target);
        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsConstructor(decorated))
            throw new TypeError();
          target = decorated;
        }
      }
      return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target, propertyKey, descriptor);
        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsObject(decorated))
            throw new TypeError();
          descriptor = decorated;
        }
      }
      return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
      var targetMetadata = Metadata.get(O);
      if (IsUndefined(targetMetadata)) {
        if (!Create)
          return void 0;
        targetMetadata = new _Map();
        Metadata.set(O, targetMetadata);
      }
      var metadataMap = targetMetadata.get(P);
      if (IsUndefined(metadataMap)) {
        if (!Create)
          return void 0;
        metadataMap = new _Map();
        targetMetadata.set(P, metadataMap);
      }
      return metadataMap;
    }
    function OrdinaryHasMetadata(MetadataKey, O, P) {
      var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn2)
        return true;
      var parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent))
        return OrdinaryHasMetadata(MetadataKey, parent, P);
      return false;
    }
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(
        O,
        P,
        /*Create*/
        false
      );
      if (IsUndefined(metadataMap))
        return false;
      return ToBoolean(metadataMap.has(MetadataKey));
    }
    function OrdinaryGetMetadata(MetadataKey, O, P) {
      var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn2)
        return OrdinaryGetOwnMetadata(MetadataKey, O, P);
      var parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent))
        return OrdinaryGetMetadata(MetadataKey, parent, P);
      return void 0;
    }
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(
        O,
        P,
        /*Create*/
        false
      );
      if (IsUndefined(metadataMap))
        return void 0;
      return metadataMap.get(MetadataKey);
    }
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
      var metadataMap = GetOrCreateMetadataMap(
        O,
        P,
        /*Create*/
        true
      );
      metadataMap.set(MetadataKey, MetadataValue);
    }
    function OrdinaryMetadataKeys(O, P) {
      var ownKeys = OrdinaryOwnMetadataKeys(O, P);
      var parent = OrdinaryGetPrototypeOf(O);
      if (parent === null)
        return ownKeys;
      var parentKeys = OrdinaryMetadataKeys(parent, P);
      if (parentKeys.length <= 0)
        return ownKeys;
      if (ownKeys.length <= 0)
        return parentKeys;
      var set = new _Set();
      var keys = [];
      for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
        var key = ownKeys_1[_i];
        var hasKey = set.has(key);
        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }
      for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
        var key = parentKeys_1[_a];
        var hasKey = set.has(key);
        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }
      return keys;
    }
    function OrdinaryOwnMetadataKeys(O, P) {
      var keys = [];
      var metadataMap = GetOrCreateMetadataMap(
        O,
        P,
        /*Create*/
        false
      );
      if (IsUndefined(metadataMap))
        return keys;
      var keysObj = metadataMap.keys();
      var iterator = GetIterator(keysObj);
      var k = 0;
      while (true) {
        var next = IteratorStep(iterator);
        if (!next) {
          keys.length = k;
          return keys;
        }
        var nextValue = IteratorValue(next);
        try {
          keys[k] = nextValue;
        } catch (e) {
          try {
            IteratorClose(iterator);
          } finally {
            throw e;
          }
        }
        k++;
      }
    }
    function Type(x) {
      if (x === null)
        return 1;
      switch (typeof x) {
        case "undefined":
          return 0;
        case "boolean":
          return 2;
        case "string":
          return 3;
        case "symbol":
          return 4;
        case "number":
          return 5;
        case "object":
          return x === null ? 1 : 6;
        default:
          return 6;
      }
    }
    function IsUndefined(x) {
      return x === void 0;
    }
    function IsNull(x) {
      return x === null;
    }
    function IsSymbol(x) {
      return typeof x === "symbol";
    }
    function IsObject(x) {
      return typeof x === "object" ? x !== null : typeof x === "function";
    }
    function ToPrimitive(input, PreferredType) {
      switch (Type(input)) {
        case 0:
          return input;
        case 1:
          return input;
        case 2:
          return input;
        case 3:
          return input;
        case 4:
          return input;
        case 5:
          return input;
      }
      var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
      var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
      if (exoticToPrim !== void 0) {
        var result = exoticToPrim.call(input, hint);
        if (IsObject(result))
          throw new TypeError();
        return result;
      }
      return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    function OrdinaryToPrimitive(O, hint) {
      if (hint === "string") {
        var toString_1 = O.toString;
        if (IsCallable(toString_1)) {
          var result = toString_1.call(O);
          if (!IsObject(result))
            return result;
        }
        var valueOf = O.valueOf;
        if (IsCallable(valueOf)) {
          var result = valueOf.call(O);
          if (!IsObject(result))
            return result;
        }
      } else {
        var valueOf = O.valueOf;
        if (IsCallable(valueOf)) {
          var result = valueOf.call(O);
          if (!IsObject(result))
            return result;
        }
        var toString_2 = O.toString;
        if (IsCallable(toString_2)) {
          var result = toString_2.call(O);
          if (!IsObject(result))
            return result;
        }
      }
      throw new TypeError();
    }
    function ToBoolean(argument) {
      return !!argument;
    }
    function ToString(argument) {
      return "" + argument;
    }
    function ToPropertyKey(argument) {
      var key = ToPrimitive(
        argument,
        3
        /* String */
      );
      if (IsSymbol(key))
        return key;
      return ToString(key);
    }
    function IsArray(argument) {
      return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
    }
    function IsCallable(argument) {
      return typeof argument === "function";
    }
    function IsConstructor(argument) {
      return typeof argument === "function";
    }
    function IsPropertyKey(argument) {
      switch (Type(argument)) {
        case 3:
          return true;
        case 4:
          return true;
        default:
          return false;
      }
    }
    function GetMethod(V, P) {
      var func = V[P];
      if (func === void 0 || func === null)
        return void 0;
      if (!IsCallable(func))
        throw new TypeError();
      return func;
    }
    function GetIterator(obj) {
      var method = GetMethod(obj, iteratorSymbol);
      if (!IsCallable(method))
        throw new TypeError();
      var iterator = method.call(obj);
      if (!IsObject(iterator))
        throw new TypeError();
      return iterator;
    }
    function IteratorValue(iterResult) {
      return iterResult.value;
    }
    function IteratorStep(iterator) {
      var result = iterator.next();
      return result.done ? false : result;
    }
    function IteratorClose(iterator) {
      var f = iterator["return"];
      if (f)
        f.call(iterator);
    }
    function OrdinaryGetPrototypeOf(O) {
      var proto = Object.getPrototypeOf(O);
      if (typeof O !== "function" || O === functionPrototype)
        return proto;
      if (proto !== functionPrototype)
        return proto;
      var prototype = O.prototype;
      var prototypeProto = prototype && Object.getPrototypeOf(prototype);
      if (prototypeProto == null || prototypeProto === Object.prototype)
        return proto;
      var constructor = prototypeProto.constructor;
      if (typeof constructor !== "function")
        return proto;
      if (constructor === O)
        return proto;
      return constructor;
    }
    function CreateMapPolyfill() {
      var cacheSentinel = {};
      var arraySentinel = [];
      var MapIterator = (
        /** @class */
        function() {
          function MapIterator2(keys, values, selector) {
            this._index = 0;
            this._keys = keys;
            this._values = values;
            this._selector = selector;
          }
          MapIterator2.prototype["@@iterator"] = function() {
            return this;
          };
          MapIterator2.prototype[iteratorSymbol] = function() {
            return this;
          };
          MapIterator2.prototype.next = function() {
            var index = this._index;
            if (index >= 0 && index < this._keys.length) {
              var result = this._selector(this._keys[index], this._values[index]);
              if (index + 1 >= this._keys.length) {
                this._index = -1;
                this._keys = arraySentinel;
                this._values = arraySentinel;
              } else {
                this._index++;
              }
              return { value: result, done: false };
            }
            return { value: void 0, done: true };
          };
          MapIterator2.prototype.throw = function(error) {
            if (this._index >= 0) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            }
            throw error;
          };
          MapIterator2.prototype.return = function(value) {
            if (this._index >= 0) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            }
            return { value, done: true };
          };
          return MapIterator2;
        }()
      );
      return (
        /** @class */
        function() {
          function Map2() {
            this._keys = [];
            this._values = [];
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          }
          Object.defineProperty(Map2.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: true,
            configurable: true
          });
          Map2.prototype.has = function(key) {
            return this._find(
              key,
              /*insert*/
              false
            ) >= 0;
          };
          Map2.prototype.get = function(key) {
            var index = this._find(
              key,
              /*insert*/
              false
            );
            return index >= 0 ? this._values[index] : void 0;
          };
          Map2.prototype.set = function(key, value) {
            var index = this._find(
              key,
              /*insert*/
              true
            );
            this._values[index] = value;
            return this;
          };
          Map2.prototype.delete = function(key) {
            var index = this._find(
              key,
              /*insert*/
              false
            );
            if (index >= 0) {
              var size = this._keys.length;
              for (var i = index + 1; i < size; i++) {
                this._keys[i - 1] = this._keys[i];
                this._values[i - 1] = this._values[i];
              }
              this._keys.length--;
              this._values.length--;
              if (key === this._cacheKey) {
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }
              return true;
            }
            return false;
          };
          Map2.prototype.clear = function() {
            this._keys.length = 0;
            this._values.length = 0;
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          };
          Map2.prototype.keys = function() {
            return new MapIterator(this._keys, this._values, getKey);
          };
          Map2.prototype.values = function() {
            return new MapIterator(this._keys, this._values, getValue);
          };
          Map2.prototype.entries = function() {
            return new MapIterator(this._keys, this._values, getEntry);
          };
          Map2.prototype["@@iterator"] = function() {
            return this.entries();
          };
          Map2.prototype[iteratorSymbol] = function() {
            return this.entries();
          };
          Map2.prototype._find = function(key, insert) {
            if (this._cacheKey !== key) {
              this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
            }
            if (this._cacheIndex < 0 && insert) {
              this._cacheIndex = this._keys.length;
              this._keys.push(key);
              this._values.push(void 0);
            }
            return this._cacheIndex;
          };
          return Map2;
        }()
      );
      function getKey(key, _) {
        return key;
      }
      function getValue(_, value) {
        return value;
      }
      function getEntry(key, value) {
        return [key, value];
      }
    }
    function CreateSetPolyfill() {
      return (
        /** @class */
        function() {
          function Set2() {
            this._map = new _Map();
          }
          Object.defineProperty(Set2.prototype, "size", {
            get: function() {
              return this._map.size;
            },
            enumerable: true,
            configurable: true
          });
          Set2.prototype.has = function(value) {
            return this._map.has(value);
          };
          Set2.prototype.add = function(value) {
            return this._map.set(value, value), this;
          };
          Set2.prototype.delete = function(value) {
            return this._map.delete(value);
          };
          Set2.prototype.clear = function() {
            this._map.clear();
          };
          Set2.prototype.keys = function() {
            return this._map.keys();
          };
          Set2.prototype.values = function() {
            return this._map.values();
          };
          Set2.prototype.entries = function() {
            return this._map.entries();
          };
          Set2.prototype["@@iterator"] = function() {
            return this.keys();
          };
          Set2.prototype[iteratorSymbol] = function() {
            return this.keys();
          };
          return Set2;
        }()
      );
    }
    function CreateWeakMapPolyfill() {
      var UUID_SIZE = 16;
      var keys = HashMap.create();
      var rootKey = CreateUniqueKey();
      return (
        /** @class */
        function() {
          function WeakMap2() {
            this._key = CreateUniqueKey();
          }
          WeakMap2.prototype.has = function(target) {
            var table = GetOrCreateWeakMapTable(
              target,
              /*create*/
              false
            );
            return table !== void 0 ? HashMap.has(table, this._key) : false;
          };
          WeakMap2.prototype.get = function(target) {
            var table = GetOrCreateWeakMapTable(
              target,
              /*create*/
              false
            );
            return table !== void 0 ? HashMap.get(table, this._key) : void 0;
          };
          WeakMap2.prototype.set = function(target, value) {
            var table = GetOrCreateWeakMapTable(
              target,
              /*create*/
              true
            );
            table[this._key] = value;
            return this;
          };
          WeakMap2.prototype.delete = function(target) {
            var table = GetOrCreateWeakMapTable(
              target,
              /*create*/
              false
            );
            return table !== void 0 ? delete table[this._key] : false;
          };
          WeakMap2.prototype.clear = function() {
            this._key = CreateUniqueKey();
          };
          return WeakMap2;
        }()
      );
      function CreateUniqueKey() {
        var key;
        do
          key = "@@WeakMap@@" + CreateUUID();
        while (HashMap.has(keys, key));
        keys[key] = true;
        return key;
      }
      function GetOrCreateWeakMapTable(target, create) {
        if (!hasOwn.call(target, rootKey)) {
          if (!create)
            return void 0;
          Object.defineProperty(target, rootKey, { value: HashMap.create() });
        }
        return target[rootKey];
      }
      function FillRandomBytes(buffer, size) {
        for (var i = 0; i < size; ++i)
          buffer[i] = Math.random() * 255 | 0;
        return buffer;
      }
      function GenRandomBytes(size) {
        if (typeof Uint8Array === "function") {
          if (typeof crypto !== "undefined")
            return crypto.getRandomValues(new Uint8Array(size));
          if (typeof msCrypto !== "undefined")
            return msCrypto.getRandomValues(new Uint8Array(size));
          return FillRandomBytes(new Uint8Array(size), size);
        }
        return FillRandomBytes(new Array(size), size);
      }
      function CreateUUID() {
        var data = GenRandomBytes(UUID_SIZE);
        data[6] = data[6] & 79 | 64;
        data[8] = data[8] & 191 | 128;
        var result = "";
        for (var offset = 0; offset < UUID_SIZE; ++offset) {
          var byte = data[offset];
          if (offset === 4 || offset === 6 || offset === 8)
            result += "-";
          if (byte < 16)
            result += "0";
          result += byte.toString(16).toLowerCase();
        }
        return result;
      }
    }
    function MakeDictionary(obj) {
      obj.__ = void 0;
      delete obj.__;
      return obj;
    }
  });
})(Reflect2 || (Reflect2 = {}));

// src/parser/tree_types.ts
var import_class_transformer = __toESM(require_cjs());
var Tree = class extends Array {
};
((Tree2) => {
  function treeMap(tree, func) {
    return tree.map((node) => node instanceof Array ? treeMap(node, func) : func(node));
  }
  Tree2.treeMap = treeMap;
})(Tree || (Tree = {}));
var TokenTree = class extends Tree {
};
((TokenTree2) => {
  function getStringArrayRepr(tree) {
    return (0, import_class_transformer.instanceToPlain)(Tree.treeMap(tree, (token) => token.lexeme));
  }
  TokenTree2.getStringArrayRepr = getStringArrayRepr;
})(TokenTree || (TokenTree = {}));

// src/parser/treeify.ts
var import_assert6 = __toESM(require("assert"));
function getTokenTree(tokenList) {
  if (tokenList[0].type === "(" /* Lpar */) {
    tokenList = tokenList.slice(1);
  }
  return new Parser(tokenList).getGrouping();
}
var Parser = class {
  constructor(tokens) {
    this.cursor = 0;
    this.tokens = tokens;
  }
  peek() {
    return this.tokens[this.cursor];
  }
  read() {
    return this.tokens[this.cursor++];
  }
  peekOffset(i) {
    (0, import_assert6.default)(this.cursor + i >= 0 && this.cursor + i < this.tokens.length);
    return this.tokens[this.cursor + i];
  }
  isEof() {
    return this.cursor >= this.tokens.length;
  }
  getGrouping() {
    const tree = [];
    while (!this.isEof()) {
      const token = this.read();
      if (token.type === "(" /* Lpar */) {
        tree.push(this.getGrouping());
      } else if (token.type === ")" /* Rpar */) {
        return tree;
      } else {
        tree.push(token);
      }
    }
    return tree;
  }
};

// src/index.ts
var compile = (program) => encode(getIntermediateRepresentation(getTokenTree(tokenize(program))));
var getParseTree = (program) => TokenTree.getStringArrayRepr(getTokenTree(tokenize(program)));
var compileParseTree = (tree) => {
  if (!(tree instanceof TokenTree)) {
    tree = Tree.treeMap(tree, getSingleToken);
  }
  return encode(getIntermediateRepresentation(tree));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compile,
  compileParseTree,
  getParseTree
});
/*! Bundled license information:

reflect-metadata/Reflect.js:
  (*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** *)
*/
