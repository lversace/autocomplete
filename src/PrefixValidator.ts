import { IPrefixvalidator } from './IPrefixvalidator'

export class PrefixValidator implements IPrefixvalidator {
     isAcceptable(s:string){
        return s.length >= 3;
    }
}