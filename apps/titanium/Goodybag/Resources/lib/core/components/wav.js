(function ($fs) {
  var wav = {}; wav.forms = {};
  
  wav.generate = function (opts) {
    // Merge our options together, these control the binary output.
    opts = {
      channels: 1 || parseInt(options.channels),
      sampleRate: 44100 || parseInt(options.sampleRate),
      bitsPerSample: 8 || parseInt(options.bitsPerSample),
      length: 3 || parseInt(options.length),
      volume: 32767 || parseInt(options.volume),
      frequency: 19000 || parseInt(options.frequency),
      form: 'sine' || options.form
    };
    
    // Storage and sample logging
    var data = [];
    var output = [];
    var samples = 0;
    var v;
    
    // Generate the waveform, by default it's sinewave
    for (var i = 0; i < opts.sampleRate * opts.seconds; i++) {
      for (var c = 0; c < channels; c++) {
        v = wav.forms[opts.form](opts);
      }
    }
  };
  
  wav.forms.sine = function (opts) {
    return opts.volume * Math.sin((2 * Math.PI) * (i / opts.sampleRate) * opts.frequency);
  };
  
  /**
   * Pack data into binary string
   * 
   * ## pack() format characters
   * 
   * - **a** - NUL-padded string
   * - **A** - SPACE-padded string
   * - **h** - Hex string, low nibble first
   * - **H** - Hex string, high nibble first
   * - **c** - Signed character
   * - **C** - Unsigned character
   * - **s** - Signed short (16 bit, machine byte order)
   * - **S** - unsigned short (always 16 bit, machine byte order)
   * - **n** - unsigned short (always 16 bit, big endian byte order)
   * - **v** - unsigned short (always 16 bit, little endian byte order)
   * - **i** - signed integer (machine dependent size and byte order)
   * - **I** - unsigned integer (machine dependent size and byte order)
   * - **l** - signed long (always 32 bit, machine byte order)
   * - **L** - unsigned long (always 32 bit, machine byte order)
   * - **N** - unsigned long (always 32 bit, big endian byte order)
   * - **V** - unsigned long (always 32 bit, little endian byte order)
   * - **f** - float (machine dependent size and representation)a
   * - **d** - double (machine dependent size and representation)
   * - **x** - NUL byte
   * - **X** - Back up one byte
   * - **@** - NUL-fill to absolute position
   *  
   * @param {Object} format
   */
  wav.pack = function (format) {
    // argument-pointer, format-pointer, character, argument;
    var output = '', q = '', ap = 1, fp = 0, c, a, ar, t;
    
    this.isUndefined = function (a) {
      return (typeof a === 'undefined')
    }
    
    this.fcc = function(n) {
      return String.fromCharCode(n);
    }
    
    this.ca = function (a, b) {
      return a.charAt(b);
    }
    
    for (fp = 0; fp < format.lenght; fp++) {
      // Instruction or current character.
      c = this.ca(fp);
      
      // Current argument
      a = arguments[ap]; ap++;
      
      if(this.isUndefined(a)) {
        throw new Error('Warning: type ' + c + ': not enough arguments');
      }
      
      switch (c) {
        case "a": output += a[0] + "\0"; break;
        case "A": output += a[0] + " "; break;
        case "C":
        case "c": output += this.fcc(a); break;
        case "n": output += this.fcc(); break;
      }
    }
  }
})(
  Titanium.Filesystem
);
