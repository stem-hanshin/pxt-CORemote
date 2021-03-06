//% weight=10 color=#1E90FF icon="\uf136"
namespace JoystickController {
    const PCA9685_ADD = 0x41;
    const MODE1 = 0x00;
    const PRESCALE = 0xFE;
    const LED0_ON_L = 0x06;
    let initialized = false;
    let serialInited = 0

    export enum Shake{
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="ON" block="ON"
        ON = 1
    }
    
    export enum mMusic {
        Dadadum = 0,
        Entertainer,
        Prelude,
        Ode,
        Nyan,
        Ringtone,
        Funk,
        Blues,

        Birthday,
        Wedding,
        Funereal,
        Punchline,
        Baddy,
        Chase,
        Ba_ding,
        Wawawawaa,
        Jump_up,
        Jump_down,
        Power_up,
        Power_down
    }
    export enum ButtonState {
        //% blockId="Press" block="Press"
        Press = 0,
        //% blockId="Release" block="Release"
        Release = 1
    }
    export enum Button {
        //% blockId="K1" block="K1"
        K1 = 0,
        //% blockId="K2" block="K2"
        K2 = 1,
        //% blockId="K3" block="K3"
        K3 = 2,
        //% blockId="K4" block="K4"
        K4 = 3,
    }
    export enum mRocker {
        //% blockId="NoState" block="NoState"
        NoState = 0,
        //% blockId="Pressed" block="Pressed"
        Pressed = 1,
        //% blockId="Up" block="Up"
        Up = 2,
        //% blockId="Down" block="Down"
        Down = 3,
        //% blockId="Left" block="Left"
        Left = 4,
        //% blockId="Right" block="Right"
        Right = 5,
        //% blockId="LeftUp" block="Left Up"
        LeftUp=6,
        //% blockId="LeftDown" block="LeftDown"
        LeftDown=7,
        //% blockId="RightUp" block="Right Up"
        RightUp=8,
        //% blockId="RightDown" block="Right Down"
        RightDown=9        
    }


//% blockId=GetButton block="Button|key %num|value %value"
//% weight=96
//% blockGap=10
//% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
export function GetButton(num: Button, value: ButtonState): boolean {
    let temp = false;
    switch (num) {
        case Button.K1: {
            pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
            if (pins.digitalReadPin(DigitalPin.P13) == value) {
                temp = true;
            }
            else {
                temp = false;
            }
            break;
        }
        case Button.K2: {
            pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
            if (pins.digitalReadPin(DigitalPin.P14) == value) {
                temp = true;
            }
            else {
                temp = false;
            }
            break;
        }
        case Button.K3: {
            pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
            if (pins.digitalReadPin(DigitalPin.P15) == value) {
                temp = true;
            }
            else {
                temp = false;
            }
            break;
        }
        case Button.K4: {
            pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
            if (pins.digitalReadPin(DigitalPin.P16) == value) {
                temp = true;
            }
            else {
                temp = false;
            }
            break;
        }
    }
    return temp;
}
    //% blockId="onButtonPressed" block="On remote button pressed  $btn"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
export function onButtonPressed(btn: Button, body: Action) {
    let Pin = 0;
    pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
    pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
    pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
    pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
    if (btn == Button.K1) {
        Pin = DigitalPin.P13;
    } else if (btn == Button.K2) {
        Pin = DigitalPin.P14;
    } else if (btn == Button.K3) {
        Pin = DigitalPin.P15;
    } else if (btn == Button.K4) {
        Pin = DigitalPin.P16;
    }
    pins.onPulsed(Pin, PulseValue.Low, body);
}

    //% blockId=AnalogRockerX block="Analog Rocker X |value %value"
    export function AnalogRockerX(): number {
        let x = pins.analogReadPin(AnalogPin.P2);
        return x;
    }
    
    //% blockId=AnalogRockerY block="Analog Rocker Y |value %value"
    export function AnalogRockerY(): number {
        let y = pins.analogReadPin(AnalogPin.P1);
        return y;
    }

    //% blockId=GetRocker block="Get Rocker value"
    export function GetRocker():number {
        let ret = mRocker.NoState;
        pins.setPull(DigitalPin.P8, PinPullMode.PullUp);
        
        let z = pins.digitalReadPin(DigitalPin.P8);
        if (z == 0){
            ret = mRocker.Pressed;
            return ret;
        }

        let y = pins.analogReadPin(AnalogPin.P1);
        let x = pins.analogReadPin(AnalogPin.P2);

        if (x <= 300) // 下
        {
            ret = mRocker.Right;
            if( y < 300 )
            {
                ret = mRocker.RightDown;
            }
            else if(y>700)
            {
                ret = mRocker.RightUp;
            }
        }
        else if (x > 700) //上
        {
            ret = mRocker.Left;
            if( y < 300 )
            {
                ret = mRocker.LeftDown;
            }
            else if( y > 700 )
            {
                ret = mRocker.LeftUp;
            }
        }
        else
        {
            // only y
            if (y < 300) //右
            {
                ret = mRocker.Down;
            }
            else if (y > 700) //左
            {
                ret = mRocker.Up;
            }
        }
        return ret;
    }

    //% blockId=Rocker block="Rocker|value %value"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Rocker(value: mRocker): boolean {
        pins.setPull(DigitalPin.P8, PinPullMode.PullUp);
        let z = pins.digitalReadPin(DigitalPin.P8);
        let y = pins.analogReadPin(AnalogPin.P1);
        let x = pins.analogReadPin(AnalogPin.P2);        
        let now_state = mRocker.NoState;               
        if (z == 0)
        {
            now_state = mRocker.Pressed;
        }
        else
        {
            if (x <= 300) // 下
            {
                now_state = mRocker.Right;
                if (y < 300) {
                    now_state = mRocker.RightDown;
                }
                else if (y > 700) {
                    now_state = mRocker.RightUp;
                }
            }
            else if (x > 700) //上
            {
                now_state = mRocker.Left;
                if (y < 300) {
                    now_state = mRocker.LeftDown;
                }
                else if (y > 700) {
                    now_state = mRocker.LeftUp;
                }
            }
            else {
                // only y
                if (y < 300) //右
                {
                    now_state = mRocker.Down;
                }
                else if (y > 700) //左
                {
                    now_state = mRocker.Up;
                }
            }
        }

        if (now_state == value)
            return true;
        else
            return false;

    }

    //% blockId=Remote_Shake block="Remote Shake|value %value"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=2
    export function Remote_Shake(value: Shake): void {
        switch (value) {
            case Shake.ON: {
                pins.digitalWritePin(DigitalPin.P12, 1)
                break;
            }
            case Shake.OFF: {
                pins.digitalWritePin(DigitalPin.P12, 0)
                break;
            }
        }
    }

    //% blockId=PlayMusic block="PlayMusic|%index"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function PlayMusic(index: mMusic): void {
        switch (index) {
            case mMusic.Dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case mMusic.Birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case mMusic.Entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case mMusic.Prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case mMusic.Ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case mMusic.Nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case mMusic.Ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case mMusic.Funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case mMusic.Blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case mMusic.Wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case mMusic.Funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case mMusic.Punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case mMusic.Baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case mMusic.Chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case mMusic.Ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case mMusic.Wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case mMusic.Jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case mMusic.Jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case mMusic.Power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case mMusic.Power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }
}
