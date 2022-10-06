import { VirtualKeyCodes } from "../../typings/virtualKeys.d";

type KeyboardKey = {
    label: string;
    shiftLabel?: string;
    size?: number;
    value: VirtualKeyCodes | null;
};
type MaybeArray<T> = T | T[];
export const keyList: MaybeArray<KeyboardKey> = [];

keyList.push.apply(keyList, [
    [
        { label: "ESC", value: VirtualKeyCodes.VK_ESCAPE },
        { label: "", size: 0.67, value: null },
        { label: "F1", value: VirtualKeyCodes.VK_F1 },
        { label: "F2", value: VirtualKeyCodes.VK_F2 },
        { label: "F3", value: VirtualKeyCodes.VK_F3 },
        { label: "F4", value: VirtualKeyCodes.VK_F4 },
        { label: "", size: 0.665, value: null },
        { label: "F5", value: VirtualKeyCodes.VK_F5 },
        { label: "F6", value: VirtualKeyCodes.VK_F6 },
        { label: "F7", value: VirtualKeyCodes.VK_F7 },
        { label: "F8", value: VirtualKeyCodes.VK_F8 },
        { label: "", size: 0.665, value: null },
        { label: "F9", value: VirtualKeyCodes.VK_F9 },
        { label: "F10", value: VirtualKeyCodes.VK_F10 },
        { label: "F11", value: VirtualKeyCodes.VK_F11 },
        { label: "F12", value: VirtualKeyCodes.VK_F12 },
    ], [
        { label: "`", shiftLabel:"~", value: VirtualKeyCodes.VK_OEM_3 },
        { label: "1", shiftLabel:"!", value: VirtualKeyCodes.VK_1 },
        { label: "2", shiftLabel:"@", value: VirtualKeyCodes.VK_2 },
        { label: "3", shiftLabel:"#", value: VirtualKeyCodes.VK_3 },
        { label: "4", shiftLabel:"$", value: VirtualKeyCodes.VK_4 },
        { label: "5", shiftLabel:"%", value: VirtualKeyCodes.VK_5 },
        { label: "6", shiftLabel:"^", value: VirtualKeyCodes.VK_6 },
        { label: "7", shiftLabel:"&", value: VirtualKeyCodes.VK_7 },
        { label: "8", shiftLabel:"*", value: VirtualKeyCodes.VK_8 },
        { label: "9", shiftLabel:"(", value: VirtualKeyCodes.VK_9 },
        { label: "0", shiftLabel:")", value: VirtualKeyCodes.VK_0 },
        { label: "-", shiftLabel:"_", value: VirtualKeyCodes.VK_OEM_MINUS },
        { label: "=", shiftLabel:"+", value: VirtualKeyCodes.VK_OEM_PLUS },
        { label: "BKSP", size: 2, value: VirtualKeyCodes.VK_BACK },
    ], [
        { label: "TAB", size: 1.5, value: VirtualKeyCodes.VK_TAB },
        { label: "Q", value: VirtualKeyCodes.VK_Q },
        { label: "W", value: VirtualKeyCodes.VK_W },
        { label: "E", value: VirtualKeyCodes.VK_E },
        { label: "R", value: VirtualKeyCodes.VK_R },
        { label: "T", value: VirtualKeyCodes.VK_T },
        { label: "Y", value: VirtualKeyCodes.VK_Y },
        { label: "U", value: VirtualKeyCodes.VK_U },
        { label: "I", value: VirtualKeyCodes.VK_I },
        { label: "O", value: VirtualKeyCodes.VK_O },
        { label: "P", value: VirtualKeyCodes.VK_P },
        { label: "[", shiftLabel:"{", value: VirtualKeyCodes.VK_OEM_4 },
        { label: "]", shiftLabel:"}", value: VirtualKeyCodes.VK_OEM_6 },
        { label: "\\", shiftLabel:"|", size: 1.5, value: VirtualKeyCodes.VK_OEM_5 },
    ], [
        { label: "CAPS", size: 1.67, value: VirtualKeyCodes.VK_CAPITAL },
        { label: "A", value: VirtualKeyCodes.VK_A },
        { label: "S", value: VirtualKeyCodes.VK_S },
        { label: "D", value: VirtualKeyCodes.VK_D },
        { label: "F", value: VirtualKeyCodes.VK_F },
        { label: "G", value: VirtualKeyCodes.VK_G },
        { label: "H", value: VirtualKeyCodes.VK_H },
        { label: "J", value: VirtualKeyCodes.VK_J },
        { label: "K", value: VirtualKeyCodes.VK_K },
        { label: "L", value: VirtualKeyCodes.VK_L },
        { label: ";", shiftLabel:":", value: VirtualKeyCodes.VK_P },
        { label: "'", shiftLabel:"\"", value: VirtualKeyCodes.VK_OEM_1 },
        { label: "ENTER", size: 2.33, value: VirtualKeyCodes.VK_RETURN },
    ], [
        { label: "SHIFT", size: 2.5, value: VirtualKeyCodes.VK_LSHIFT },
        { label: "Z", value: VirtualKeyCodes.VK_Z },
        { label: "X", value: VirtualKeyCodes.VK_X },
        { label: "C", value: VirtualKeyCodes.VK_C },
        { label: "V", value: VirtualKeyCodes.VK_V },
        { label: "B", value: VirtualKeyCodes.VK_B },
        { label: "N", value: VirtualKeyCodes.VK_N },
        { label: "M", value: VirtualKeyCodes.VK_M },
        { label: ",", shiftLabel:"<", value: VirtualKeyCodes.VK_OEM_COMMA },
        { label: ".", shiftLabel:">", value: VirtualKeyCodes.VK_OEM_PERIOD },
        { label: "/", shiftLabel:"?", value: VirtualKeyCodes.VK_OEM_2 },
        { label: "SHIFT", size: 2.5, value: VirtualKeyCodes.VK_RSHIFT },
    ], [
        { label: "CTRL", size: 1.5, value: VirtualKeyCodes.VK_LCONTROL },
        { label: "WIN", value: VirtualKeyCodes.VK_LWIN },
        { label: "ALT", size: 1.33, value: VirtualKeyCodes.VK_LMENU },
        { label: "", size:6.34, value: VirtualKeyCodes.VK_SPACE },
        { label: "ALT", size: 1.33, value: VirtualKeyCodes.VK_RMENU },
        { label: "WIN", value: VirtualKeyCodes.VK_RWIN },
        { label: "APP", value: VirtualKeyCodes.VK_APPS },
        { label: "CTRL", size: 1.5, value: VirtualKeyCodes.VK_RCONTROL },
    ],
]);