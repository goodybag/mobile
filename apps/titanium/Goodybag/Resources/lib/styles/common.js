(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.common = {
    scrollView: {
      width: $ui.FILL,
      layout: 'vertical',
      showVerticalScrollIndicator: true
    },
    
    "go": {
      build: {
        type: "createLabel"
      },
      width: 25,
      height: 25,
      text: '\ue112',
      textAlign: "right",
      color: $color.gray,
      font: {
        fontSize: 16,
        fontFamily: 'LigatureSymbols'
      }
    },
   
    "labelBtns": {
      "red": {
        build: {
          type: "createLabel"
        },
        width: $ui.FILL,
        height: 40,
        top: 7,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#802420',
        textAlign: "center",
        color: '#fff',
        font: {
          fontSize: $font.base.fontSize,
          fontWeight: "bold"
        },
        shadowOffset: {
          x: 0,
          y: -1
        },
        shadowColor: 'rgba(0,0,0, 0.5)',
        backgroundGradient: {
          type: 'linear',
          startPoint: {
            x: 0,
            y: 0
          },
          endPoint: {
            x: 0,
            y: '100%'
          },
          colors: [{
            color: '#EE5F5B',
            offset: 0.0
          }, {
            color: '#BD362F',
            offset: 1.0
          }]
        }
      },
   
      "blue": {
        build: {
          type: "createLabel"
        },
        width: $ui.FILL,
        height: 40,
        top: 7,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#027291',
        textAlign: "center",
        color: '#fff',
        font: {
          fontSize: $font.base.fontSize,
          fontWeight: "bold"
        },
        shadowOffset: {
          x: 0,
          y: -1
        },
        shadowColor: 'rgba(0,0,0, 0.5)',
        backgroundGradient: {
          type: 'linear',
          startPoint: {
            x: 0,
            y: 0
          },
          endPoint: {
            x: 0,
            y: '100%'
          },
          colors: [{
            color: '#00bfff',
            offset: 0.0
          }, {
            color: '#0390bf',
            offset: 1.0
          }]
        }
      }
    },
   
    "loader": {
      "base": {
        width: $ui.FILL,
        height: '25%',
        left: 10,
        right: 10,
        borderRadius: 5,
        opacity: 0,
        zIndex: -1,
        build: {
          type: "createView"
        }
      },
   
      "background": {
        width: $ui.FILL,
        height: $ui.FILL,
        backgroundColor: '#000',
        opacity: 0.7,
        build: {
          type: "createView"
        }
      },
      "middle": {
        width: $ui.FILL,
        height: $ui.SIZE,
        left: 20,
        right: 20,
        layout: 'vertical',
        zIndex: 1001,
        build: {
          type: "createView"
        }
      },
   
      "spinner": {
        width: 40,
        height: 40,
        top: 10,
        build: {
          type: "createActivityIndicator"
        }
      },
   
      "text": {
        width: $ui.FILL,
        height: $ui.SIZE,
        top: 10,
        bottom: 10,
        text: "Loading",
        color: $color.white,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
          fontSize: 18,
          fontWeight: "bold"
        },
        build: {
          type: "createLabel"
        }
      }
    },
   
    "grayPage": {
      "base": {
        backgroundColor: $color.grayLightest,
        top: 54
      },
      
      "header1": {
        width: $ui.FILL,
        height: $ui.SIZE,
        color: $color.grayDarker,
        shadowOffset: {
          x: 0,
          y: 1
        },
        shadowColor: '#fff',
        font: {
          fontSize: 18,
          fontWeight: "bold"
        }
      },
      "wrapper": {
        width: $ui.FILL,
        height: $ui.SIZE,
        layout: 'vertical',
        left: 8,
        right: 8,
        bottom: 8
      },
      
      "island": {
        "base": {
          width: $ui.FILL,
          height: $ui.SIZE,
          borderRadius: 7
        },
        
        "header1": {
          width: $ui.FILL,
          height: $ui.SIZE,
          color: $color.grayDarker,
          font: {
            fontSize: 14,
            fontWeight: "bold"
          }
        },
        
        "header2": {
          width: $ui.FILL,
          height: $ui.SIZE,
          color: $color.grayDark,
          font: {
            fontSize: 16,
            fontWeight: "bold"
          }
        },
        
        "paragraph": {
          width: $ui.FILL,
          height: $ui.SIZE,
          color: $color.grayDark,
          font: {
            fontSize: 14
          }
        },
        
        "inputWrapper": {
          width: $ui.FILL,
          height: $ui.SIZE,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: $color.grayLightest,
          backgroundGradient: {
            type: 'linear',
            startPoint: {
              x: 0,
              y: '100%'
            },
            endPoint: {
              x: 0,
              y: 0
            },
            colors: [{
              color: '#f1f1f1',
              offset: 0.0
            }, {
              color: '#fff',
              offset: 1.0
            }]
          }
        },
        
        "input": {
          width: $ui.FILL,
          height: $ui.SIZE,
          top: 9,
          bottom: 9,
          left: 6,
          right: 5,
          backgroundImage: 'screens/login/transparent.png',
          borderStyle: $ui.INPUT_BORDERSTYLE_NONE,
          autocapitalization: $ui.TEXT_AUTOCAPITALIZATION_NONE,
          autocorrect: false,
          color: $color.grayDark,
          font: {
            fontSize: 14
          }
        },
        
        "input:indicated": {
          width: $ui.FILL,
          height: $ui.SIZE,
          top: 10,
          bottom: 10,
          left: 6,
          right: 50,
          backgroundImage: 'screens/login/transparent.png',
          borderStyle: $ui.INPUT_BORDERSTYLE_NONE,
          autocapitalization: $ui.TEXT_AUTOCAPITALIZATION_NONE,
          autocorrect: false,
          color: $color.grayDark,
          font: {
            fontSize: 14
          }
        },
        
        "indicator": {
          width: $ui.SIZE,
          height: $ui.SIZE,
          right: 10,
          bottom: -10,
          text: "*",
          shadowOffset: {
            x: 0,
            y: 1
          },
          color: $color.green,
          font: {
            fontSize: 36,
            fontWeight: 'bold'
          },
          opacity: 0,
          build: {
            type: "createLabel"
          }
        },
        
        "wrapper": {
          width: $ui.FILL,
          height: $ui.SIZE,
          left: 6,
          right: 6,
          top: 6,
          bottom: 6,
          layout: 'vertical'
        },
        
        "fill": {
          width: $ui.FILL,
          height: $ui.SIZE,
          layout: 'vertical',
          bottom: 1,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#eee',
          backgroundColor: '#fff',
          backgroundGradient: {
            type: 'linear',
            startPoint: {
              x: 0,
              y: '100%'
            },
            endPoint: {
              x: 0,
              y: '20%'
            },
            colors: [{
              color: '#eee',
              offset: 0.0
            }, {
              color: '#fff',
              offset: 1.0
            }]
          }
        },
        
        "shadow": {
          width: $ui.FILL,
          height: 5,
          left: 1,
          bottom: 0,
          backgroundColor: '#000',
          opacity: 0.05
        },
        
        "bottomNavWrapper": {
          width: $ui.FILL,
          height: $ui.SIZE,
          top: 8
          // , layout: 'horizontal'
        },
        
        "buttons": {
          "gray": {
            "default": {
              width: '100dp',
              height: '40dp',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#D6D6D6',
              color: $color.grayDark,
              font: {
                fontSize: 13,
                fontWeight: 'bold'
              },
              shadowOffset: {
                x: 0,
                y: 1
              },
              shadowColor: $color.white,
              opacity: 1,
              backgroundGradient: {
                type: 'linear',
                startPoint: {
                  x: 0,
                  y: 0
                },
                endPoint: {
                  x: 0,
                  y: '100%'
                },
                colors: [{
                  color: '#fafafa',
                  offset: 0.0
                }, {
                  color: '#e3e3e3',
                  offset: 1.0
                }]
              },
              topShadow: {
                color: '#fff',
                opacity: 1
              },
              bottomShadow: {
                color: '#fff',
                opacity: 1
              }
            },
            
            "active": {
              backgroundGradient: {
                type: 'linear',
                startPoint: {
                  x: 0,
                  y: 0
                },
                endPoint: {
                  x: 0,
                  y: '100%'
                },
                colors: [{
                  color: '#e3e3e3',
                  offset: 0.0
                }, {
                  color: '#e3e3e3',
                  offset: 1.0
                }]
              },
              topShadow: {
                color: '#e3e3e3',
                opacity: 1
              },
              opacity: 1
            },
            
            "disabled": {
              opacity: 0.4
            }
          } // Gray
        }
      },
      
      "buttons": {
        
        // Red
        "red": {
          "default": {
            width: $ui.FILL,
            height: '40dp',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#802420',
            color: $color.white,
            font: {
              fontSize: 13,
              fontWeight: 'bold'
            },
            shadowOffset: {
              x: 0,
              y: -1
            },
            shadowColor: '#9f342e',
            opacity: 1,
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#EE5F5B',
                offset: 0.0
              }, {
                color: '#BD362F',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#f38b88',
              opacity: 1
            },
            bottomShadow: {
              color: '#fff',
              opacity: 0.4
            }
          },
          
          "active": {
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#BD362F',
                offset: 0.0
              }, {
                color: '#BD362F',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#BD362F',
              opacity: 1
            },
            bottomShadow: {
              color: '#fff',
              opacity: 0.4
            },
            opacity: 1
          },
          "disabled": {
            opacity: 0.4
          }
        },

        // Green
        "green": {
          "default": {
            width: $ui.FILL,
            height: '40dp',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#387038',
            color: $color.white,
            font: {
              fontSize: 13,
              fontWeight: 'bold'
            },
            shadowOffset: {
              x: 0,
              y: -1
            },
            shadowColor: '#4b904b',
            opacity: 1,
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#62C462',
                offset: 0.0
              }, {
                color: '#51A351',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#8dd58d',
              opacity: 1
            },
            bottomShadow: {
              color: '#fff',
              opacity: 0.4
            }
          },
          
          "active": {
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#51A351',
                offset: 0.0
              }, {
                color: '#51A351',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#51A351',
              opacity: 1
            },
            bottomShadow: {
              color: '#fff',
              opacity: 0.4
            },
            opacity: 1
          },
          "disabled": {
            opacity: 0.4
          }
        },
        
        // Gray has a less pronounced bottom shadow.
        "gray": {
          "default": {
            width: '100dp',
            height: '40dp',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ccc',
            color: $color.grayDark,
            font: {
              fontSize: 13,
              fontWeight: 'bold'
            },
            shadowOffset: {
              x: 0,
              y: 1
            },
            shadowColor: $color.white,
            opacity: 1,
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#fafafa',
                offset: 0.0
              }, {
                color: '#e3e3e3',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#fff',
              opacity: 1
            },
            bottomShadow: {
              color: '#fff',
              opacity: 0.4
            }
          },
          
          "active": {
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#e3e3e3',
                offset: 0.0
              }, {
                color: '#e3e3e3',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#e3e3e3',
              opacity: 1
            },
            opacity: 1
          },
          "disabled": {
            opacity: 0.4
          }
        }
      }
    },
    
    "bluePage": {
      "base": {
        backgroundColor: '#1f7eba'
      },
      
      "baseText": {
        width: $ui.FILL,
        height: $ui.SIZE,
        shadowOffset: {
          x: 0,
          y: -1
        },
        shadowColor: $color.blueDark,
        color: $color.white,
        font: {
          fontSize: 14
        }
      },
      
      "header1": {
        width: $ui.FILL,
        height: $ui.SIZE,
        textAlign: "center",
        color: $color.white,
        shadowOffset: {
          x: 0,
          y: -1
        },
        shadowColor: $color.blueDark,
        font: {
          fontSize: 28
        }
      },
      
      "fieldset": {
        width: $ui.FILL,
        height: $ui.SIZE,
        top: 10,
        layout: 'vertical',
        borderRadius: 10,
        borderWidth: '1dp',
        borderColor: '#2e6284',
        backgroundColor: '#fff'
      },
      
      "field": {
        "wrapper": {
          width: $ui.FILL,
          height: $ui.SIZE,
          layout: 'horizontal'
        },
        
        "input": {
          width: $ui.FILL,
          height: 40,
          left: 10,
          color: $color.gray,
          backgroundImage: 'screens/login/transparent.png',
          borderStyle: $ui.INPUT_BORDERSTYLE_NONE,
          autocapitalization: $ui.TEXT_AUTOCAPITALIZATION_NONE,
          autocorrect: false,
          font: {
          }
        },
        
        "indicator": {
          "base": {
            width: $ui.FILL,
            height: 20,
            right: 10,
            backgroundImage: 'screens/register/indicator-gray.png'
          },
          
          "green": {
            backgroundImage: 'screens/register/indicator-green.png'
          },
          
          "red": {
            backgroundImage: 'screens/register/indicator-red.png'
          }
        },
        
        "password": {
          passwordMask: true,
        },
        
        "separator": {
          width: $ui.FILL,
          height: 1,
          backgroundColor: $color.grayLighter
        }
      },
      
      "buttons": {
        "blue": {
          "default": {
            width: '100dp',
            height: '40dp',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#165b87',
            color: '#fff',
            font: {
              fontSize: 13,
              fontWeight: 'bold'
            },
            shadowOffset: {
              x: 0,
              y: -1
            },
            shadowColor: $color.blueDark,
            opacity: 1,
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#1f7eba',
                offset: 0.0
              }, {
                color: '#0667a0',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#5097c6',
              opacity: 1
            },
            bottomShadow: {
              color: '#fff',
              opacity: 0.08
            }
          },
          
          "active": {
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#0667a0',
                offset: 0.0
              }, {
                color: '#0667a0',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#0667a0',
              opacity: 1
            },
            opacity: 1
          },
          
          "disabled": {
            opacity: 0.4
          }
        },
        
        "gray": {
          "default": {
            width: '100dp',
            height: '40dp',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#1d70a5',
            color: $color.grayDark,
            font: {
              fontSize: 13,
              fontWeight: 'bold'
            },
            shadowOffset: {
              x: 0,
              y: 1
            },
            shadowColor: $color.white,
            opacity: 1,
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#ffffff',
                offset: 0.0
              }, {
                color: '#b3c8d9',
                offset: 1.0
              }]
            },
            topShadow: {
              color: '#fff',
              opacity: 1
            },
            bottomShadow: {
              color: '#1c73aa',
              opacity: 1
            }
          },
          
          "active": {
            backgroundGradient: {
              type: 'linear',
              startPoint: {
                x: 0,
                y: 0
              },
              endPoint: {
                x: 0,
                y: '100%'
              },
              colors: [{
                color: '#b3c8d9',
                offset: 0.0
              }, {
                color: '#b3c8d9',
                offset: 1.0
              }]
            },
            opacity: 1
          },
          
          "disabled": {
            opacity: 0.4
          }
        }
      }
    },
    
    infini: {
      layout: "vertical"
    },
    
    animation: {
      "fadeIn": {
        opacity: 1,
        duration: 600
      },
      
      "fadeOut": {
        opacity: 0,
        duration: 600
      }
    }
  };
  
  $iphone.common = {
    loader: {
      spinner: {
        style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
      }
    }
  };
  
  $android.common = {
    infini: {
      scrollType: 'vertical'
    },
    
    grayPage: {
      island: {
        inputWrapper: {
          height: 35
        },
        input: {
          top: 0,
          bottom: 0
        },
        "input:indicated": {
          top: 0,
          bottom: -10
        },
        indicator: {
          bottom: 0
        }
      }
    }
  };
  
  $xhdpi.common = {
    greyPage: {
      base: {
        top: '54dp'
      }
    }
  };
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);