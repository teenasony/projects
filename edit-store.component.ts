import { Component, OnInit , Input, ViewChild ,ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title }  from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap';
import { Http, Response, Headers, RequestOptions } from '@angular/http';



import { StoreService } from '../../services/store/store.service';
import { environment } from '../../../environments/environment';
import { AccountsService } from '../../services/accounts/accounts.service';



@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.css'],
  providers: [
   StoreService,AccountsService
  ]
})
export class EditStoreComponent implements OnInit {


@ViewChild('editModal') public editModal:ModalDirective;
@ViewChild('CheckPublishModal') public CheckPublishModal:ModalDirective;
@ViewChild('changeModal') public changeModal:ModalDirective;
@ViewChild('ImageModal') public ImageModal:ModalDirective;
@ViewChild('ibanModal') public ibanModal:ModalDirective;
private loading: boolean = false;
private shopId: Observable<string>;
private shopIdObserver: Observable<any>;
private shopDetail: Observable<any>;
private delivery: Observable<any>;
private province: Observable<any>;
private cities: Observable<any>;
private sectors: Observable<any>;
private selectstore: Observable<any>;
private user_type_id: number;
showIndicator = false;
myInterval = 0;
private editShopData : any = {
   "first_name": "",
   "second_name": "",
   "shop_name": "",
   "shop_email":"",
   "contact_email":"",
   "ph_no": "",
   "country_id":"2",
   "province_id": "",
   "city_id":"",
   "address": "",
   "zip": "",
   "cif":"",
   "din":"",
   "sector_name": "",
   "sector_id":"",
   "bank_account": "",
   "iban_no": "",
   "dis_percentage":"",
   "store_con_no":"",
   "pub_flag":"",
   "shop_description":"",
   "main_image":"",
   "image_one":"",
   "image_two":"",
   "image_three":""

};

private shopImagePlaceholderURL: string = "../assets/images/add-photo.png";
inputEl: any;
private fileName:any;
private SecondFileName:any;
private ThirdFileName:any;
private FourthFileName:any;
private imageUpload: any = {
     "upload":""
 };
 private SecondimageUpload: any = {
      "upload":""
  };
  private ThirdimageUpload: any = {
       "upload":""
   };
   private FourthimageUpload: any = {
        "upload":""
    };
 form: FormGroup;
 private ImageUploadURL: string = `${environment.api.host}:${environment.api.port}${environment.api.base}${environment.api.api}/${environment.api.version}${environment.api.services.store.uploadImage}/@shopId@/imagType/1`;
 private SeondImageUploadURL: string = `${environment.api.host}:${environment.api.port}${environment.api.base}${environment.api.api}/${environment.api.version}${environment.api.services.store.uploadImage}/@shopId@/imagType/2`;
 private ThirdImageUploadURL: string = `${environment.api.host}:${environment.api.port}${environment.api.base}${environment.api.api}/${environment.api.version}${environment.api.services.store.uploadImage}/@shopId@/imagType/3`;
 private FourthImageUploadURL: string = `${environment.api.host}:${environment.api.port}${environment.api.base}${environment.api.api}/${environment.api.version}${environment.api.services.store.uploadImage}/@shopId@/imagType/4`;
 @Input() multiple: boolean = false;
 @ViewChild('fileInput') fileInput: ElementRef;
 public check_publish_status:boolean;
 public check_all_object: boolean;
 public shop_description: string;
 private CheckChanges: boolean ;
 private hideFirstImage: boolean;
 private showFirstImage: boolean = true;
 private setFirstImage: boolean;
 private hideSecondImage: boolean;
 private showSecondImage: boolean = true;
 private setSecondImage: boolean;
 private hideThirdImage: boolean;
 private showThirdImage: boolean = true;
 private setThirdImage: boolean;
 private showFourthImage: boolean = true;
 private hideFourthImage: boolean;
 private setFourthImage: boolean;
 private notAllowed: boolean = true;
 private clearSecondImage: boolean;

constructor(private formBuilder: FormBuilder,private http: Http,private fb: FormBuilder,private storeService: StoreService, private route: ActivatedRoute,private accountService: AccountsService,private titleService: Title,private router: Router) {
    this.createForm();
 }

  ngOnInit() {
  var self = this;
  self.setTitle();
  self.fetchProvince();
  self.getSector();
  self.setShopId().subscribe(() => {
      self.fetchShopData();
   });
  self.getSelectedStore();
  }


private setTitle() {
   var self = this;
   self.route.data.forEach((data: any) => {
     self.titleService.setTitle(data.title);
   });
 }

 private setShopId(){
 var self = this;
 var shopIdObserver = new Observable( (observer) => {
   self.route.params.forEach((params: Params) => {
     self.shopId = params['id'];
     console.log(self.shopId);
     observer.next(self.shopId);
   });
 });
 self.shopIdObserver = shopIdObserver;
 return shopIdObserver;
}

private fetchShopData(){
     var self = this;
     self.loading = true;
     self.shopDetail = self.storeService.getShopDetail(self.shopId);
     self.shopDetail.subscribe((res:any) => {
       this.editShopData.first_name = res.first_name;
       this.editShopData.second_name = res.second_name;
       this.editShopData.shop_name = res.shop_name;
       this.editShopData.shop_email = res.shop_email;
       this.editShopData.contact_email = res.contact_email;
       this.editShopData.ph_no = res.ph_no;
       this.editShopData.country_name = res.country_name;
       this.editShopData.province_name = res.province_name;
       this.editShopData.city_name = res.city_name;
       this.editShopData.address = res.address;
       this.editShopData.zip = res.zip;
       this.editShopData.cif = res.cif;
       this.editShopData.din = res.din;
       this.editShopData.sector_name = res.sector_name;
       this.editShopData.bank_account = res.bank_account;
       this.editShopData.iban_no = res.iban_no;
       this.editShopData.home_service = res.home_service;
       this.editShopData.min_amount = res.min_amount
       this.editShopData.shop_delivered = res.shop_delivered;
       this.editShopData.delivery_charge = res.delivery_charge;
       this.editShopData.dis_percentage = res.dis_percentage;
       this.editShopData.max_del_time = res.max_del_time;
       this.editShopData.province_id = res.province;
       this.editShopData.city_id = res.city;
       this.editShopData.sector_id = res.sector_id;
       this.editShopData.store_con_no = res.store_con_no;
       this.editShopData.shop_description = res.shop_description;
       this.editShopData.main_image = res.main_image;
       this.editShopData.image_one = res.image_one;
       this.editShopData.image_two = res.image_two;
       this.editShopData.image_three = res.image_three;
       this.editShopData.product = res.product;
       self.cities = self.accountService.getCity(res.province);
       if(this.editShopData.bank_account == 0){
         this.editShopData.bank_account = null;
       }

       if( this.editShopData.image_one == ""){
          this.editShopData.image_one = null
       }
       if( this.editShopData.image_two == ""){
          this.editShopData.image_two = null
       }
       if( this.editShopData.image_three == ""){
          this.editShopData.image_three = null
       }
       self.loading = false;
       console.log('second image',this.editShopData.image_one);
       console.log('third image',this.editShopData.image_two);
       console.log('fourth image',this.editShopData.image_three);
       console.log('shop data',res);
       }, () => {
       console.log('shop data failed');
     })
  }

  private getShopImageURL(key){
    var self = this;

    if(key) {
      return `${environment.api.host}:${environment.api.port}${environment.api.base}${environment.api.imageFolder}/${key}`;
    }
    else{
      return self.shopImagePlaceholderURL;

    }
  }

      private fetchDeadline(){
        var self = this;
        self.delivery = self.storeService.getMaxDeliverytime();
     }

     ngOnChanges() {
         if (this.form.valueChanges) {
             console.log("The form is dirty!");
             this.check_publish_status = true;
             this.check_all_object = true;
         }
     }

     changeAllObject() {
         if (this.form.valueChanges) {
             this.check_all_object = true;
             this.CheckChanges = true;
         }
     }

     updateShop(){
       var self = this;
       self.changeModal.hide();
       self.loading = true;
       if(self.check_publish_status == true){
         self.editShopData['pub_flag'] = 0;
       }
      if(self.CheckChanges == true){
         self.editShopData['pub_flag'] = 1;
       }
       if(self.editShopData.iban_no == "" && self.editShopData.bank_account == ""){
         self.loading = false;
         self.ibanModal.show();
         return false;
       }
       self.storeService.editShop(self.shopId,self.editShopData).subscribe((res: any) => {
      //    if(self.check_publish_status == true){
      //    self.CheckPublishModal.show();
      //  }
      //  else{
      //    self.editModal.show();
      //  }
      if(self.CheckChanges == true){
      self.editModal.show();
    }
    else{
      self.CheckPublishModal.show();
    }
         self.loading = false;
         console.log('updation sucess');
         }, (err) => {
           console.log('updation failed');
         });
     }

     hideEditModal(){
       var self = this;
       self.editModal.hide();
       self.router.navigate(['/home']);
     }

     hideCheckPublishModal(){
       var self = this;
       self.CheckPublishModal.hide();
       self.router.navigate(['/shop', self.shopId]);
     }

fetchProvince() {
 var self =this;
 self.province = self.accountService.getProvince();

}


getValueFromSelectProvince(value){
  var self =this;
  console.log('provice id',value);
  self.cities = self.accountService.getCity(value);
}

ibanChange(val) {
    const self = this;
    let chIbn = val.split(' ').join('');
    if (chIbn.length > 0) {
      chIbn = chIbn.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    console.log(chIbn);
    this.editShopData.iban_no = chIbn;
  }



  bankChange(value) {
     if (value.length > 4 && !(value.indexOf('-') > -1)) {
       let sub1 = value.substring(0, 4);
       let sub2 = value.substring(4, value.length);
       this.editShopData.bank_account =sub1 + '-' + sub2;
     }
     else {
       this.editShopData.bank_account = value;
     }

   }


  onFileChange(event,shopId) {
    var self = this;
    this.check_all_object = true;
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileName = file.name;
      this.imageUpload['upload'] = this.fileName;
      this.form.get('upload').setValue(file);
      console.log(file);
      console.log('filename',this.fileName);
    }
    self.check_publish_status = true;
    this.imageUpload['upload'] = this.fileName;
    const formModel = this.prepareSave();
    this.loading = true;
    var body = formModel;

    let shop_id = this.shopId;
    console.log('shop id',shop_id);
    let url = this.ImageUploadURL.replace('@shopId@',shopId);
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + this.accountService.accessToken);
    let options = new RequestOptions({ headers: headers });

    console.log(options);
    console.log(body);
    console.log(url);
     return this.http.post(url, body, options)
          .catch(error => Observable.throw(error))
          .subscribe(
              data => {
self.fetchShopData();
self.loading = false;
                console.log('success',data)},
              error => console.log(error)

        )

  }

  SecondFileChange(event,shopId) {
    var self = this;
    self.showSecondImage = true;
    self.hideSecondImage = false;
    this.check_all_object = true;
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.SecondFileName = file.name;
      this.SecondimageUpload['upload'] = this.SecondFileName;
      this.form.get('upload').setValue(file);
      console.log(file);
      console.log('filename',this.SecondFileName);
    }
    self.check_publish_status = true;
    this.SecondimageUpload['upload'] = this.SecondFileName;
    const formModel = this.SeondprepareSaves();
    this.loading = true;
    var body = formModel;
    let shop_id = this.shopId;
    console.log('shop id',shop_id);
    let url = this.SeondImageUploadURL.replace('@shopId@',shopId);
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + this.accountService.accessToken);
    let options = new RequestOptions({ headers: headers });

    console.log(options);
    console.log(body);
    console.log(url);
     return this.http.post(url, body, options)
          .catch(error => Observable.throw(error))
          .subscribe(
              data => {
self.fetchShopData();
self.loading = false;
                console.log('success',data)},
              error => console.log(error)

        )

  }

  ThirdFileChange(event,shopId) {
    var self = this;
    self.showThirdImage = true;
    self.hideThirdImage = false;
    this.check_all_object = true;
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.ThirdFileName = file.name;
      this.ThirdimageUpload['upload'] = this.ThirdFileName;
      this.form.get('upload').setValue(file);
      console.log(file);
      console.log('filename',this.ThirdFileName);
    }
    self.check_publish_status = true;
    this.ThirdimageUpload['upload'] = this.ThirdFileName;
    const formModel = this.ThirdprepareSaves();
    this.loading = true;
    var body = formModel;
    let shop_id = this.shopId;
    console.log('shop id',shop_id);
    let url = this.ThirdImageUploadURL.replace('@shopId@',shopId);
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + this.accountService.accessToken);
    let options = new RequestOptions({ headers: headers });

    console.log(options);
    console.log(body);
    console.log(url);
     return this.http.post(url, body, options)
          .catch(error => Observable.throw(error))
          .subscribe(
              data => {
self.fetchShopData();
self.loading = false;
                console.log('success',data)},
              error => console.log(error)

        )

  }


  FourthFileChange(event,shopId) {
    var self = this;
    self.showFourthImage = true;
    self.hideFourthImage = false;
    this.check_all_object = true;
    self.loading = true;
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.FourthFileName = file.name;
      this.FourthimageUpload['upload'] = this.FourthFileName;
      this.form.get('upload').setValue(file);
      console.log(file);
      console.log('filename',this.FourthFileName);
    }
    self.check_publish_status = true;
    this.FourthimageUpload['upload'] = this.FourthFileName;
    const formModel = this.FourthprepareSaves();
    var body = formModel;
    let shop_id = this.shopId;
    console.log('shop id',shop_id);
    let url = this.FourthImageUploadURL.replace('@shopId@',shopId);
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + this.accountService.accessToken);
    let options = new RequestOptions({ headers: headers });

    console.log(options);
    console.log(body);
    console.log(url);
     return this.http.post(url, body, options)
          .catch(error => Observable.throw(error))
          .subscribe(
              data => {
  self.fetchShopData();
  self.loading = false;
                console.log('success',data)},
              error => console.log(error)

        )

  }

updateImage(){
    var self = this;
    this.check_all_object = true;
    if (self.editShopData.main_image === null || self.editShopData.image_one === null) {
       console.log('i am null');
       return false;
     }
   else{
    var mainimageval =  self.editShopData.main_image ;
    self.editShopData.main_image = self.editShopData.image_one;
    self.editShopData.image_one = mainimageval;
    self.storeService.editShop(self.shopId,self.editShopData).subscribe((res: any) => {
      console.log('i am updated')
   })
}
  self.fetchShopData();
  console.log( 'main image change', self.editShopData.main_image);
  console.log( 'image one change', self.editShopData.image_one);
  }

  updateImage2(){
    var self = this;
    this.check_all_object = true;
    if (self.editShopData.main_image === null || self.editShopData.image_two === null || self.editShopData.image_two === '') {
       console.log('i am null');
       return false;
     }
   else{
    var mainimageval =  self.editShopData.main_image ;
    self.editShopData.main_image = self.editShopData.image_two;
    self.editShopData.image_two = mainimageval;
    self.storeService.editShop(self.shopId,self.editShopData).subscribe((res: any) => {
      console.log('i am updated')
   })
 }
  self.fetchShopData();

  }

  updateImage3(){
    var self = this;
    this.check_all_object = true;
    if (self.editShopData.main_image === null || self.editShopData.image_three  === null) {
       console.log('i am null');
       return false;
     }
   else{
    var mainimageval =  self.editShopData.main_image ;
    self.editShopData.main_image = self.editShopData.image_three;
    self.editShopData.image_three = mainimageval;
    self.storeService.editShop(self.shopId,self.editShopData).subscribe((res: any) => {
      console.log('i am updated')
   })
 }
  self.fetchShopData();

  }


  createForm() {
    this.form = this.fb.group({
      upload: null
    });
  }


  private prepareSave(): any {
   let inputVal = new FormData();
   inputVal.append('upload', this.form.get('upload').value,this.imageUpload['upload']);
   console.log(inputVal);
   return inputVal;
 }

 private SeondprepareSaves(): any {
  let inputValue = new FormData();
  inputValue.append('upload', this.form.get('upload').value,this.SecondimageUpload['upload']);
  console.log(inputValue);
  return inputValue;
}

private ThirdprepareSaves(): any {
 let inputValues = new FormData();
 inputValues.append('upload', this.form.get('upload').value,this.ThirdimageUpload['upload']);
 console.log(inputValues);
 return inputValues;
}

private FourthprepareSaves(): any {
 let inputValus = new FormData();
 inputValus.append('upload', this.form.get('upload').value,this.FourthimageUpload['upload']);
 console.log(inputValus);
 return inputValus;
}

 getSector(){
 var self = this;
 self.sectors = self.accountService.getSectors();
 }

 private getSelectedStore(){
 var self = this;
 self.loading = true;
 self.selectstore = self.storeService.getSelectedStores();
 self.selectstore.subscribe((res:any) => {
   self.user_type_id = res.user_type_id;
   self.loading = false;
   console.log('user type',self.user_type_id);
   console.log('selectedShops',res);
 }, () => {
   console.log('failed');
 })
}

cifChange(val) {
 let self=this;
  val = val.trim();
  let valid = false;
  if (val.length === 9) {

    const prefix = val.charAt(0);
    if (new RegExp('^[ABCDEFGHJUV]').test(prefix)) {
      valid = new RegExp('^[a-zA-Z][0-9]{8}$').test(val);
    } else if (new RegExp('^[PQRSWN]').test(prefix)) {
      valid = (val.match(new RegExp('[0-9]', 'g')) || []).length === 7;

    }

    if(!valid){
      self.editShopData.cif='';
    }

    console.log('valid',valid)
  }
}

submitImageModal(shop_description){
  var self = this;
  self.shop_description = shop_description;
  console.log('shop_description',self.shop_description);
  self.ImageModal.hide();
}

hideImageModal(){
  var self = this;
  self.ImageModal.hide();
  self.editModal.hide();
  self.CheckPublishModal.show();
}

deleteFirstImage(){
  var self = this;
  self.showFirstImage = false;
  self.hideFirstImage = true;
  self.setFirstImage = true;
}

deleteSecondImage(){
  var self = this;
  self.showSecondImage = false;
  self.hideSecondImage = true;
  self.clearSecondImage = true;
  if(self.clearSecondImage == true){
    self.editShopData.image_one = "1";
  }
}

deleteThirdImage(){
  var self = this;
  self.showThirdImage = false;
  self.hideThirdImage = true;
  self.setThirdImage = true;
  if(self.setThirdImage == true){
    self.editShopData.image_two = "1";
  }
}

deleteFourthImage(){
  var self = this;
  self.showFourthImage = false;
  self.hideFourthImage = true;
  self.setFourthImage = true;
  if(self.setFourthImage == true){
    self.editShopData.image_three = "1";
  }
}

editImage(){
  var self = this;
  self.ImageModal.hide();
  if(self.setFirstImage == true){
    self.editShopData.main_image = null;
  }
  self.storeService.editShop(self.shopId,self.editShopData).subscribe((res: any) => {
    console.log('image delete');
    console.log('response',res);
  });
    self.fetchShopData();
}

}
