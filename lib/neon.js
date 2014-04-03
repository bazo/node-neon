/// <reference path="../typings/node/node.d.ts" />
var Neon = (function () {
    function Neon() {
        this.BLOCK = 1;
    }
    Neon.prototype.is_numeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    Neon.prototype.is_float = function (n) {
        return n === +n && n !== (n | 0);
    };

    Neon.prototype.encode = function ($var, $options) {
        if ($var instanceof Date) {
            return $var.toString();
        }

        var $isList = false;
        if ($var instanceof Array) {
            $isList = true;
            var array = $var;
            $var = {};
            for (var i = 0; i <= array.length - 1; i++) {
                var v = array[i];
                $var[i] = v;
            }
        }

        if (typeof ($var) === 'object' && $var !== null) {
            var $s = '';
            if ($options & this.BLOCK) {
                if (Object.keys($var).length === 0) {
                    return "[]";
                }

                for (var $k in $var) {
                    var $v = $var[$k];
                    $v = this.encode($v, this.BLOCK);
                    $s += ($isList ? '-' : this.encode($k) + ':') + ($v.indexOf("\n") === false ? ' ' + $v : "\n\t" + $v.replace("\n", "\n\t")) + "\n";
                    continue;
                }
                return $s;
            } else {
                for (var $k in $var) {
                    var $v = $var[$k];
                    $s += ($isList ? '' : (this.is_numeric($k) ? this.encode(parseInt($k)) : this.encode($k)) + ': ') + this.encode($v) + ', ';
                }
                return ($isList ? '[' : '{') + $s.substring(0, $s.length - 2) + ($isList ? ']' : '}');
            }
        } else if (typeof ($var) === 'string' && !this.is_numeric($var) && !$var.match('~[\x00-\x1F]|^\d{4}|^(true|false|yes|no|on|off|null)\z~i') && $var.match('~^' + NeonDecoder.patterns[1] + '\z~x')) {
            return $var;
        } else if (this.is_float($var)) {
            $var = JSON.stringify($var);
            return $var.indexOf('.') === false ? $var + '.0' : $var;
        } else {
            return JSON.stringify($var);
        }
    };
    return Neon;
})();
exports.Neon = Neon;

var NeonDecoder = (function () {
    function NeonDecoder() {
    }
    NeonDecoder.patterns = [
        '\'[^\'\n]*\' |' + '"(?: \\\\. | [^"\\\\\n] )*"',
        '(?: [^#"\',:=[\]{}()\x00-\x20!`-] | [:-][^"\',\]})\s] )' + '(?:' + '[^,:=\]})(\x00-\x20]+ |' + ':(? ! [\s,\]})] | $ ) |' + '[\ \t] + [^#,:=\]})(\x00-\x20]' + ')*',
        '[,:=[\]{ }()-]',
        '?:\#.*',
        '\n[\t\ ]*',
        '?:[\t\ ]+'
    ];
    return NeonDecoder;
})();
exports.NeonDecoder = NeonDecoder;
//module.exports = Neon;
//# sourceMappingURL=neon.js.map
