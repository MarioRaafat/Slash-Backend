import {prisma} from "../seed.js";
import faker from "faker";

const shirtImages = [
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Ftie-house.com%2Fwp-content%2Fuploads%2F2021%2F09%2FIMG_8236-web.jpg&imgrefurl=https%3A%2F%2Ftie-house.com%2Fproduct%2Fslim-fit-shirt-dark-blue-5%2F&docid=YDbQmirtoAE7QM&tbnid=nFKqKAo_U6Ru4M&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECGQQAA..i&w=1000&h=1500&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECGQQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Ftie-house.com%2Fwp-content%2Fuploads%2F2024%2F01%2F00009573.jpg&imgrefurl=https%3A%2F%2Ftie-house.com%2Fproduct%2Fregular-fit-shirt-gray-5%2F&docid=n8axBp_N0gZiCM&tbnid=B5UHRA3PeM500M&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECBwQAA..i&w=1000&h=1500&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECBwQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0266%2F6276%2F4597%2Ffiles%2F300982130BEIGE_1_800x.jpg%3Fv%3D1717055224&imgrefurl=https%3A%2F%2Fwww.westside.com%2Fcollections%2Fcasual-shirts-for-women&docid=Zs6Lv3tx-y9sLM&tbnid=986xE_2UzLh28M&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECFsQAA..i&w=768&h=1024&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECFsQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Fgant.eg%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2Fa7fb2ceeb77a10c6d85416091e497fc7%2F3%2F0%2F3000202_423_main_1.jpg&imgrefurl=https%3A%2F%2Fgant.eg%2Fmen%2Ftops-men%2Fshirts.html&docid=7vxbLXIiGWHfkM&tbnid=lOLT5zB1wIe29M&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECCgQAA..i&w=600&h=750&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECCgQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Fstatic.zara.net%2Fassets%2Fpublic%2Fc80e%2F9e3a%2Fed7c40c69108%2F3f35f5a0bf28%2F01889160407-016-p%2F01889160407-016-p.jpg%3Fts%3D1730377763712%26w%3D824&imgrefurl=https%3A%2F%2Fwww.zara.com%2Feg%2Fen%2Fwoman-shirts-l1217.html&docid=ElyC7pKPjViOZM&tbnid=deOsiVN2W2HQfM&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECHwQAA..i&w=850&h=1275&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECHwQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=http%3A%2F%2Fwww.hancockfashion.com%2Fcdn%2Fshop%2Ffiles%2F16111WhiteS_1.jpg%3Fv%3D1686897841&imgrefurl=https%3A%2F%2Fwww.hancockfashion.com%2Fproducts%2Fhancock-women-white-solid-pure-cotton-regular-fit-formal-shirt-16111white&docid=-QBl3AEe4GV8pM&tbnid=M8rhwzMCH1D_WM&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECCUQAA..i&w=1080&h=1440&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECCUQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Fassets.myntassets.com%2Fh_1440%2Cq_100%2Cw_1080%2Fv1%2Fassets%2Fimages%2F13722908%2F2021%2F3%2F3%2Fd1ee19bd-73c9-4ca4-a8e9-624c18128a6e1614752690702-Roadster-Women-Black--White-Regular-Fit-Checked-Casual-Shirt-1.jpg&imgrefurl=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Froadster%2Froadster-women-black--white-regular-fit-checked-cotton-casual-shirt%2F13722908%2Fbuy&docid=ZnkD0ibxguzAtM&tbnid=sRiE2nLtQ3AFXM&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECEsQAA..i&w=1080&h=1440&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECEsQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Fpeplosjeans.in%2Fcdn%2Fshop%2Ffiles%2F18.png%3Fv%3D1709640015%26width%3D1080&imgrefurl=https%3A%2F%2Fpeplosjeans.in%2Fproducts%2Fregular-fit-multi-colour-casual-premium-shirts-for-men&docid=yrXUAGW_BNZ-3M&tbnid=_93F4WVjVCwKcM&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECDgQAA..i&w=1080&h=1620&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECDgQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Ftie-house.com%2Fwp-content%2Fuploads%2Felementor%2Fthumbs%2F4R6A4581-qbuaa3dmxqxr56wlhgi2zvn87j025t33fd0a27flew.jpg&imgrefurl=https%3A%2F%2Ftie-house.com%2Fproduct%2Fplain-shirt-2%2F&docid=OFYtTw5dvLKm9M&tbnid=_W1YVzQQAjuSEM&vet=12ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECDQQAA..i&w=600&h=900&hcb=2&ved=2ahUKEwiBnf2r2MeJAxX3VKQEHQVDPaUQM3oECDQQAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Fwww.apella.in%2Fcdn%2Fshop%2Ffiles%2FDaybreakDazzleWoollenShirt_1.jpg%3Fv%3D1701668543%26width%3D1946&imgrefurl=https%3A%2F%2Fwww.apella.in%2Fproducts%2Fdaybreak-dazzle-woollen-shirt&docid=vLGF7-1uTfmYyM&tbnid=0udl44GwbuJZVM&vet=12ahUKEwiLiPLG2seJAxVmTaQEHcYrHIA4ChAzegQIVhAA..i&w=1946&h=2919&hcb=2&ved=2ahUKEwiLiPLG2seJAxVmTaQEHcYrHIA4ChAzegQIVhAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=http%3A%2F%2Fcobbitaly.com%2Fcdn%2Fshop%2Fproducts%2FNVFSRE4092NAVYBLUE_1.jpg%3Fv%3D1665659100%26width%3D2048&imgrefurl=https%3A%2F%2Fcobbitaly.com%2Fproducts%2Fnvfsre4092navyblue&docid=iVtH1i1gcc-TIM&tbnid=I8eUFlQNn0V9mM&vet=12ahUKEwiLiPLG2seJAxVmTaQEHcYrHIA4ChAzegQIbxAA..i&w=1080&h=1440&hcb=2&ved=2ahUKEwiLiPLG2seJAxVmTaQEHcYrHIA4ChAzegQIbxAA",
    "https://www.google.com/imgres?q=shirt%20images&imgurl=https%3A%2F%2Fassets.ajio.com%2Fmedias%2Fsys_master%2Froot%2F20230609%2FDoTY%2F64834c8742f9e729d735587b%2F-473Wx593H-443013006-ltblue-MODEL.jpg&imgrefurl=https%3A%2F%2Fazorte.ajio.com%2Foutryt-women-oversized-shirt-with-patch-pocket%2Fp%2F443013006_ltblue&docid=7RCpWsonoXAuHM&tbnid=7USgNl1JtJmloM&vet=12ahUKEwiLiPLG2seJAxVmTaQEHcYrHIA4ChAzegQIZhAA..i&w=473&h=593&hcb=2&ved=2ahUKEwiLiPLG2seJAxVmTaQEHcYrHIA4ChAzegQIZhAA",
];

const pantsImages = [
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Feg.jumia.is%2Funsafe%2Ffit-in%2F500x500%2Ffilters%3Afill(white)%2Fproduct%2F57%2F780883%2F1.jpg%3F0147&imgrefurl=https%3A%2F%2Fwww.jumia.com.eg%2Ffashion-khakimen-street-apparel-cargo-pants-hip-hop-sweatpants-fashion-pants-gyms-casual-jogging-pants-mens-fastener-pants-om-38808775.html&docid=m1slLGm61ZMDXM&tbnid=yXybKXnx9GfewM&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECHsQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECHsQAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fmedia.gq.com%2Fphotos%2F654a66099efb7efc0873124f%2F3%3A4%2Fw_748%252Cc_limit%2FStraight-Leg-Pant.jpg&imgrefurl=https%3A%2F%2Fwww.gq.com%2Fstory%2Fbest-casual-pants&docid=Bey7SCI1wDhdqM&tbnid=n6EM0L8WznXjEM&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECF8QAA..i&w=748&h=997&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECF8QAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Feg.jumia.is%2Funsafe%2Ffit-in%2F500x500%2Ffilters%3Afill(white)%2Fproduct%2F89%2F308704%2F1.jpg%3F9644&imgrefurl=https%3A%2F%2Fwww.jumia.com.eg%2Ffashion-748-beigey2k-pockets-cargo-pants-for-women-straight-oversize-pants-harajuku-vintage-aesthetic-low-waist-trousers-wide-leg-baggy-jeans-3xl-dou-40780398.html&docid=xPOYPHX6ZtlO7M&tbnid=IIwh96TAN4-TNM&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECEoQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECEoQAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fwww.ninoskids.com%2Fcdn%2Fshop%2Ffiles%2F35454f87becfaf35522c6d9ee4261331_d57994e2-d6ff-4638-a8cd-226ef3ebb38d_1024x1024.jpg%3Fv%3D1721575323&imgrefurl=https%3A%2F%2Fwww.ninoskids.com%2Fen%2Fproducts%2Fgabardine-pants-113&docid=AD62ZqT_aTx6mM&tbnid=34_YYaOhJ5CC3M&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECC0QAA..i&w=770&h=1024&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECC0QAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fwww.jozeeboutique.com%2Fwp-content%2Fuploads%2F2022%2F02%2Fplain-harem-pant-3-4.jpgg_.jpg&imgrefurl=https%3A%2F%2Fwww.jozeeboutique.com%2Fshop%2Fethnic%2Fpants-ethnic%2Fblack-linen-harem-pants-2%2F&docid=AipDWIN--RI6HM&tbnid=8ePZmXgG87OizM&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECHQQAA..i&w=850&h=1000&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECHQQAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Ftie-house.com%2Fwp-content%2Fuploads%2F2023%2F07%2F00000107.jpg&imgrefurl=https%3A%2F%2Ftie-house.com%2Fproduct%2Fregular-fit-classic-pants-light-brown%2F&docid=W5sfywJsScQO-M&tbnid=sd1yxhnmA1vYpM&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECEwQAA..i&w=1000&h=1500&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECEwQAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fassets.adidas.com%2Fimages%2Fw_1880%2Cf_auto%2Cq_auto%2Fdc5c6e032df244be89c81fde057d2116_9366%2FIN1497_21_model.jpg&imgrefurl=https%3A%2F%2Fwww.adidas.com.eg%2Fen%2Fown-the-run-pants%2FIN1497.html&docid=jFcZPjAZTY_p_M&tbnid=pDynzTrSpOmcyM&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECEQQAA..i&w=1880&h=1880&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECEQQAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fimages.squarespace-cdn.com%2Fcontent%2Fv1%2F5b4d499589c172c35e3b63cc%2F3ff336a9-f8c7-4ba9-9d69-cc571b4899da%2FNeutrally-Nicole-Casual-Fall-Transitional-Outfit-Cargo-Pants-Outfit-02.jpg&imgrefurl=https%3A%2F%2Fwww.neutrallynicole.com%2Fblog%2Fcargo-pants-outfit&docid=y9OWPbGK9v0bmM&tbnid=UhAMoyN2Cbh1fM&vet=12ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECBsQAA..i&w=1638&h=2048&hcb=2&ved=2ahUKEwjH7tXj2seJAxU0T6QEHeO3CsAQM3oECBsQAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fwww.jozeeboutique.com%2Fwp-content%2Fuploads%2F2023%2F06%2FStraight-linen-pants_set_pantslinen-tops-9-.jpg&imgrefurl=https%3A%2F%2Fwww.jozeeboutique.com%2Fshop%2Fethnic%2Fpants-ethnic%2Folive-green-linen-pants-2-sizes%2F&docid=ivcZvbf2_s3bcM&tbnid=CyXSGQrLcIaicM&vet=12ahUKEwiuytmC28eJAxVjVKQEHex9E3A4ChAzegQIcxAA..i&w=850&h=1000&hcb=2&ved=2ahUKEwiuytmC28eJAxVjVKQEHex9E3A4ChAzegQIcxAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fmedia.maxfashion.com%2Fi%2Fmax%2FB22WCLFSRA110YELLOWMULTISHADE-B22WCLFSRA110-MXSS22020922_01-2100.jpg%3F%24prodimg-d-prt-2%24%26%24quality-standard%24%26fmt%3Dauto%26sm%3Dc&imgrefurl=https%3A%2F%2Fwww.maxfashion.com%2Feg%2Fen%2Fc%2Fmxwomen-clothing-pantsandleggings-pants&docid=Py9-WV8FgAGfcM&tbnid=HPfTKd9y-_XqWM&vet=12ahUKEwiuytmC28eJAxVjVKQEHex9E3A4ChAzegQIKBAA..i&w=610&h=903&hcb=2&ved=2ahUKEwiuytmC28eJAxVjVKQEHex9E3A4ChAzegQIKBAA",
    "https://www.google.com/imgres?q=pants%20images&imgurl=https%3A%2F%2Fstatic.nike.com%2Fa%2Fimages%2Ft_PDP_936_v1%2Ff_auto%2Cq_auto%3Aeco%2F76b5cc0d-9b4d-4690-9cf5-70b08ce6d50c%2FM%2BSOLO%2BSWSH%2BTRK%2BPANT.png&imgrefurl=https%3A%2F%2Fwww.nike.com%2Ft%2Fsolo-swoosh-mens-track-pants-p1Z2bG&docid=84DSVf4YnBBC3M&tbnid=Wnm2D8fB4QvLvM&vet=12ahUKEwiuytmC28eJAxVjVKQEHex9E3A4ChAzegQIcRAA..i&w=936&h=1170&hcb=2&ved=2ahUKEwiuytmC28eJAxVjVKQEHex9E3A4ChAzegQIcRAA",
];

const shoesImages = [
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fassets.adidas.com%2Fimages%2Fw_1880%2Cf_auto%2Cq_auto%2F8aaacd7fd9c445ac9300ae740095dac4_9366%2FGX7330_09_standard.jpg&imgrefurl=https%3A%2F%2Fwww.adidas.com.eg%2Fen%2Fcampus-shoes%2FGX7330.html&docid=miijfSygWVBNpM&tbnid=pxWqCERfXoAWwM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGIQAA..i&w=1880&h=1880&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGIQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1350560575%2Fphoto%2Fpair-of-blue-running-sneakers-on-white-background-isolated.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DA3w_a9q3Gz-tWkQL6K00xu7UHdN5LLZefzPDp-wNkSU%3D&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Ftrainers-shoes&docid=BJxcKtnjyt5KiM&tbnid=4-rVqn4vTkkHJM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECBgQAA..i&w=612&h=408&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECBgQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fassets.adidas.com%2Fimages%2Fw_1880%2Cf_auto%2Cq_auto%2F556563da5c4d4c1eb8815418984f6e74_9366%2FIF3654_01_standard.jpg&imgrefurl=https%3A%2F%2Fwww.adidas.com.eg%2Fen%2Fsuperstar-shoes%2FIF3654.html&docid=aQdamIvJ6YlQ3M&tbnid=rYlXNZVlKa5HdM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECFIQAA..i&w=1880&h=1880&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECFIQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fcdn.thewirecutter.com%2Fwp-content%2Fmedia%2F2024%2F05%2Frunningshoesforyou-2048px-2251.jpg%3Fauto%3Dwebp%26quality%3D75%26width%3D1024&imgrefurl=https%3A%2F%2Fwww.nytimes.com%2Fwirecutter%2Freviews%2Fbest-running-shoes%2F&docid=5tYUhOre-jfjuM&tbnid=4vFw0Ec5rY95lM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGMQAA..i&w=1024&h=683&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGMQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fcdn.thewirecutter.com%2Fwp-content%2Fmedia%2F2024%2F05%2Frunning-shoes-2048px-9718.jpg&imgrefurl=https%3A%2F%2Fwww.nytimes.com%2Fwirecutter%2Freviews%2Fbest-running-shoes%2F&docid=5tYUhOre-jfjuM&tbnid=XPh_mdIda7WbyM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECFMQAA..i&w=2048&h=1365&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECFMQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2F5.imimg.com%2Fdata5%2FSELLER%2FDefault%2F2022%2F11%2FYV%2FZF%2FYO%2F116453489%2Fwhite-casual-shoes-for-men.jpg&imgrefurl=https%3A%2F%2Fwww.indiamart.com%2Fproddetail%2Fwhite-casual-shoes-for-men-27525710573.html&docid=MuhQkZkKwDY6RM&tbnid=IkQKvvkht-RnPM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGQQAA..i&w=2000&h=2000&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGQQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Ft3.ftcdn.net%2Fjpg%2F01%2F21%2F81%2F86%2F360_F_121818673_6EID5iF76VCCc4aGOLJkd94Phnggre3o.jpg&imgrefurl=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dshoes&docid=hdqcYjCldVhdRM&tbnid=CV3THigW5DUXYM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGAQAA..i&w=540&h=360&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGAQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-photo%2Fpair-trainers_144627-3799.jpg&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2FShoes&docid=MTrOg4Ua3wmkqM&tbnid=sIQGQrOWL5UrxM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECCEQAA..i&w=626&h=527&hcb=2&itg=1&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECCEQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2023%2F05%2F03%2F22%2F43%2Ftennis-7968714_1280.png&imgrefurl=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fshoes%2F&docid=lYKkjHV3oibnXM&tbnid=LE26hD63tbkcxM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGkQAA..i&w=1280&h=1187&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECGkQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fcontents.mediadecathlon.com%2Fp1985522%2F2e55fd5a52b5304b959738d33fd1f053%2Fp1985522.jpg&imgrefurl=https%3A%2F%2Fwww.decathlon.in%2Fp%2F8351755_run-100-men-s-running-shoes-grey.html%3Freviews_page%3D5&docid=mJfzoiqbtpv2NM&tbnid=4l4f_7QT-aaxFM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECEIQAA..i&w=3833&h=3833&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECEIQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fassets.adidas.com%2Fimages%2Fh_840%2Cf_auto%2Cq_auto%2Cfl_lossy%2Cc_fill%2Cg_auto%2F2d560cfb19f641e49e5c8cf18ac07552_9366%2FAlphaboost_V2_Shoes_Black_IH0695_01_standard.jpg&imgrefurl=https%3A%2F%2Fwww.adidas.com%2Fus%2Falphaboost-v2-shoes%2FIH0695.html&docid=3eWJClEsC6gPaM&tbnid=TCLKpRpnZT343M&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECEYQAA..i&w=840&h=840&hcb=2&itg=1&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECEYQAA",
    "https://www.google.com/imgres?q=shoes%20images&imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F2529147%2Fpexels-photo-2529147.jpeg%3Fcs%3Dsrgb%26dl%3Dpexels-melvin-buezo-1253763-2529147.jpg%26fm%3Djpg&imgrefurl=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fshoe%2F&docid=Yao7P1QnaChnmM&tbnid=byKDZq3iIGxgyM&vet=12ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECDUQAA..i&w=4599&h=5749&hcb=2&ved=2ahUKEwi_9Y6Y28eJAxW8RqQEHX2jJvoQM3oECDUQAA",
];

const dressImages = [
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Feg.jumia.is%2Funsafe%2Ffit-in%2F500x500%2Ffilters%3Afill(white)%2Fproduct%2F44%2F277904%2F1.jpg%3F6341&imgrefurl=https%3A%2F%2Fwww.jumia.com.eg%2Ffashion-01-dark-blueoffice-lady-elegant-summer-sleeveless-dress-women-casual-turn-down-collar-belt-dress-v-neck-slim-solid-long-party-dress-xxl-dou-40977244.html&docid=dUTgkI6PieKTuM&tbnid=8U6dEHCCtTyo4M&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECGwQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECGwQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Feg.jumia.is%2Funsafe%2Ffit-in%2F500x500%2Ffilters%3Afill(white)%2Fproduct%2F85%2F423244%2F1.jpg%3F6040&imgrefurl=https%3A%2F%2Fwww.jumia.com.eg%2Ffashion-whitesummer-black-print-maxi-dress-plus-size-s-4xl-flower-long-sleeve-women-chiffon-long-dress-vestidos-maa-44232458.html&docid=bQqHg7IxgCHZmM&tbnid=ninxDCtArcXooM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oFCIMBEAA..i&w=500&h=500&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oFCIMBEAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=http%3A%2F%2Fwww.vastranand.in%2Fcdn%2Fshop%2Ffiles%2F1_871d6045-82d0-4209-b464-46ce51a4c7f3.jpg%3Fv%3D1716447638&imgrefurl=https%3A%2F%2Fwww.vastranand.in%2Fproducts%2Fploy-georgette-floral-printed-dress&docid=SUbvBE0SR_qtqM&tbnid=qyL4eivkMu5LUM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECG0QAA..i&w=1080&h=1440&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECG0QAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fimg.fruugo.com%2Fproduct%2F9%2F38%2F876776389_0340_0340.jpg&imgrefurl=https%3A%2F%2Fwww.fruugo.eg%2Fwomens-elegant-a-line-off-shoulder-evening-party-dress-for-wedding-guest-birthday-dress-for-cocktail-vestidos-de-novia%2Fp-186573877-398389585%3Flanguage%3Den&docid=o8wvH-ugNXtTCM&tbnid=ljXmPwpaGMRjlM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oFCIIBEAA..i&w=340&h=340&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oFCIIBEAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fassets.ajio.com%2Fmedias%2Fsys_master%2Froot%2F20240406%2FjTor%2F6610dc8616fd2c6e6aa17c06%2F-473Wx593H-466855053-yellow-MODEL.jpg&imgrefurl=https%3A%2F%2Fwww.ajio.com%2Ffery-london-women-floral-print-fit--flared-dress%2Fp%2F466855053_yellow&docid=lr_UElzVrUayPM&tbnid=496iyO7o7RFD7M&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECEIQAA..i&w=473&h=593&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECEIQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Faroka.in%2Fcdn%2Fshop%2Ffiles%2FAroka06-10-233944_fa19b681-8a87-4c40-8f8d-70e87d24b3ba.jpg%3Fv%3D1724408298%26width%3D1445&imgrefurl=https%3A%2F%2Faroka.in%2Fproducts%2Fgrace-ruched-dress&docid=prbegzbfb9ggMM&tbnid=-FfT3ImmUUfyaM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECHoQAA..i&w=590&h=885&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECHoQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Feg.jumia.is%2Funsafe%2Ffit-in%2F500x500%2Ffilters%3Afill(white)%2Fproduct%2F26%2F427904%2F1.jpg%3F5389&imgrefurl=https%3A%2F%2Fwww.jumia.com.eg%2Ffashion-greenfloral-dress-women-casual-print-dress-v-neck-midi-dresses-female-short-sleeve-button-loosed-dress-summer-holiday-beach-vestidos-dou-40972462.html&docid=8nbiV6eP24FtLM&tbnid=gQFZf27nROrzcM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECHwQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECHwQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.bullionknot.com%2Fcdn%2Fshop%2Ffiles%2FSongbirdmin_4.jpg%3Fv%3D1711431567%26width%3D2500&imgrefurl=https%3A%2F%2Fwww.bullionknot.com%2Fcollections%2Fparty-wear-dresses&docid=eWsX11M_xAr4iM&tbnid=wXsAAOyBvGyQlM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECFsQAA..i&w=2500&h=3750&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECFsQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=http%3A%2F%2Fwww.oliviabottega.com%2Fcdn%2Fshop%2Ffiles%2FMonro1_ba561f93-0be6-4279-b3e1-9405880ea51d_1200x630.jpg%3Fv%3D1682434037&imgrefurl=https%3A%2F%2Fwww.oliviabottega.com%2Fcollections%2Fdresses-for-party&docid=a4hhOZ6wAdyU3M&tbnid=xj_gx5k3oNkeFM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECGcQAA..i&w=420&h=630&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECGcQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=http%3A%2F%2Fdimesnco.com%2Fcdn%2Fshop%2Fcollections%2Fparty_dresses.png%3Fv%3D1706791017&imgrefurl=https%3A%2F%2Fdimesnco.com%2Fcollections%2Fparty-dresses&docid=erj8DVVUz6QdRM&tbnid=mGPQLE89-3H9AM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECFMQAA..i&w=1340&h=1785&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECFMQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.bunaai.com%2Fcdn%2Fshop%2Ffiles%2FBold_Beautiful-2879.jpg%3Fv%3D1684567745%26width%3D2048&imgrefurl=https%3A%2F%2Fwww.bunaai.com%2Fproducts%2Fcherry-blossom-embroidered-dres&docid=LJUwPUTdX0oGPM&tbnid=HGqItT6xXWr2BM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECE4QAA..i&w=2048&h=2048&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECE4QAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.labelbyanuja.in%2Fcdn%2Fshop%2Ffiles%2F20230511_231433000_iOS.jpg%3Fv%3D1686983407%26width%3D1200&imgrefurl=https%3A%2F%2Fwww.labelbyanuja.in%2Fproducts%2Froyal-blue-maxi-dress&docid=0_jOmVz9kmLS_M&tbnid=Cv00pJnkSfTvSM&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECD0QAA..i&w=1200&h=1800&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECD0QAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.farahtalibaziz.com.pk%2Fimages%2Fthumbs%2F0005991_celina-aqua-trailled-bridal_1000.jpeg&imgrefurl=https%3A%2F%2Fwww.farahtalibaziz.com.pk%2Fbridals-2&docid=_0Z5DB9zqJQwrM&tbnid=XsyRoJnVBlNR6M&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECDcQAA..i&w=726&h=999&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECDcQAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.soosi.co.in%2Fcdn%2Fshop%2Fproducts%2FIMG-20190407-WA0047_2048x.jpg%3Fv%3D1571711111&imgrefurl=https%3A%2F%2Fwww.soosi.co.in%2Fproducts%2Flong-indian-dress-with-frill-mirror-hand-work-daman&docid=H1vvRBOEgRxjhM&tbnid=4935fqSkg-s87M&vet=12ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECB8QAA..i&w=856&h=1280&hcb=2&ved=2ahUKEwib9JXO28eJAxU0RaQEHZqDIscQM3oECB8QAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.biba.in%2Fdw%2Fimage%2Fv2%2FBKQK_PRD%2Fon%2Fdemandware.static%2F-%2FSites-biba-product-catalog%2Fdefault%2Fdw96bb8571%2Fimages%2Fss24%2Fcasual2481ss24yel_1.jpg%3Fsw%3D502%26sh%3D753&imgrefurl=https%3A%2F%2Fwww.biba.in%2Fintl%2Fyellow-rayon-tiered-dress%2FCASUAL2481SS24YEL.html&docid=wCL-RnD45xiohM&tbnid=dC7Q6sJT2Sa-sM&vet=12ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIShAA..i&w=502&h=753&hcb=2&ved=2ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIShAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fi.etsystatic.com%2F5609612%2Fr%2Fil%2Fc57b61%2F1094495755%2Fil_fullxfull.1094495755_8o2y.jpg&imgrefurl=https%3A%2F%2Fwww.etsy.com%2Fil-en%2Flisting%2F464998004%2Fwinter-wool-dress-vintage-long-women&docid=NoF3Y57GNWXrQM&tbnid=JUsPUtVvZ3uZDM&vet=12ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIJBAA..i&w=680&h=1019&hcb=2&ved=2ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIJBAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.monsoonlondon.com%2Fdw%2Fimage%2Fv2%2FBDLV_PRD%2Fon%2Fdemandware.static%2F-%2FSites-monsoon-master-catalog%2Fdefault%2Fdw4931a8e1%2Fimages%2Flarge%2F21_52800870003_1.jpg%3Fsw%3D470%26sh%3D602%26sm%3Dcut&imgrefurl=https%3A%2F%2Fwww.monsoonlondon.com%2Fsa%2Fchildren%2Fgirls-clothing-3-12yrs%2Fgirls-dresses%2F&docid=30u2d3Jh3gbEWM&tbnid=j5LE9fuZodYQKM&vet=12ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIAhAA..i&w=470&h=602&hcb=2&ved=2ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIAhAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fwww.alamodelabel.in%2Fcdn%2Fshop%2Ffiles%2F775FEF49-B998-4706-A24D-3D9A6FCA9595_800x.jpg%3Fv%3D1724261164&imgrefurl=https%3A%2F%2Fwww.alamodelabel.in%2Fproducts%2Fravello-luxe-summer-dress-in-yellow&docid=53y_fQnOgCPQ7M&tbnid=zOrzsyx1e-RpyM&vet=12ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIFxAA..i&w=800&h=1000&hcb=2&ved=2ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIFxAA",
    "https://www.google.com/imgres?q=dress%20images&imgurl=https%3A%2F%2Fkarunakhaitan.in%2Fcdn%2Fshop%2Fproducts%2F107A2417final_1024x.jpg%3Fv%3D1664602191&imgrefurl=https%3A%2F%2Fkarunakhaitan.in%2Fproducts%2Faelina-dress&docid=BDdAdUZ-4a_ikM&tbnid=YN_2IZoG0nvfgM&vet=12ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIJRAA..i&w=1024&h=1536&hcb=2&ved=2ahUKEwi2xeaF3MeJAxU5Q6QEHXNsGBM4ChAzegQIJRAA",
];

const shortsImages = [
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fstengeg.com%2Fcdn%2Fshop%2Ffiles%2Fmen_24_06_2024_IMG_2536_4ddd261f-9e30-414a-a327-812535fb1b4c.jpg%3Fcrop%3Dcenter%26height%3D4000%26v%3D1720388122%26width%3D3333&imgrefurl=https%3A%2F%2Fstengeg.com%2Fcollections%2Fmen-swimming-shorts%2Fproducts%2Fshort-men-baggy&docid=Cn43T0cCPlNFYM&tbnid=W9WSMJGurkr3AM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECBUQAA..i&w=3333&h=4000&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECBUQAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fwww.americaneagle.com.eg%2Fassets%2Fstyles%2FAmericanEagle%2F4131_7536_069%2Fimage-thumb__1100575__product_listing%2F4131_7536_069_of.jpg&imgrefurl=https%3A%2F%2Fwww.americaneagle.com.eg%2Fen%2Famerican-eagle%2Fshop-men%2Fbottoms%2Fshorts%2F&docid=U0rZgeM6GURxtM&tbnid=JNTpxWvgHo25fM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oFCIIBEAA..i&w=450&h=577&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oFCIIBEAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fwww.americaneagle.com.eg%2Fassets%2Fstyles%2FAmericanEagle%2F0132_7338_238%2Fimage-thumb__847419__product_listing%2F0132_7338_238_of.jpg&imgrefurl=https%3A%2F%2Fwww.americaneagle.com.eg%2Fen%2Famerican-eagle%2Fshop-men%2Fbottoms%2Fshorts%2F&docid=U0rZgeM6GURxtM&tbnid=T3BlGNwmdDiDdM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECCsQAA..i&w=450&h=577&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECCsQAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fstatic.nike.com%2Fa%2Fimages%2Fc_limit%2Cw_592%2Cf_auto%2Ft_product_v1%2Fe2e89b8e-a451-4b7b-8f7b-e71a20af9c9c%2FM%2BNK%2BDFADV%2BSTEALTH%2BAPS%2BSHORT.png&imgrefurl=https%3A%2F%2Fwww.nike.com%2Fw%2Fmens-shorts-38fphznik1&docid=9gx6tXI1-CUHqM&tbnid=OlnxznHkxrx9zM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECFMQAA..i&w=592&h=592&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECFMQAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fwww.gymshark.com%2F_next%2Fimage%3Furl%3Dhttps%253A%252F%252Fimages.ctfassets.net%252Fwl6q2in9o7k3%252F1Tf7JoOzg87JuIBIxovE7s%252F5d1d3f5de969e0aeaf69a59b14f74d83%252FMens_Shorts_Shop_By_Collection_Mesh.jpg%26w%3D3840%26q%3D90&imgrefurl=https%3A%2F%2Fwww.gymshark.com%2Fcollections%2Fshorts%2Fmens&docid=m9-qM6WN7ih7SM&tbnid=KpOl-9Gj5hK52M&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECD0QAA..i&w=1080&h=1350&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECD0QAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fmedia.gq.com%2Fphotos%2F66717076f5fa1decccf1d996%2F1%3A1%2Fw_4390%2Ch_4390%2Cc_limit%2Fmescal%2520shorts%25202157968146.jpeg&imgrefurl=https%3A%2F%2Fwww.gq.com%2Fstory%2Fpaul-mescal-short-shorts-gucci-show&docid=mCuuhh7oSHdhMM&tbnid=McqtNwGWciLuSM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECDMQAA..i&w=4390&h=4390&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECDMQAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fhips.hearstapps.com%2Fhmg-prod%2Fimages%2Fchubbies-02-1530282135.jpg%3Fcrop%3D1xw%3A1xh%3Bcenter%2Ctop%26resize%3D640%3A*&imgrefurl=https%3A%2F%2Fwww.esquire.com%2Fstyle%2Fmens-fashion%2Fa21638656%2Fshorts-fit-guide-men%2F&docid=Wj3qKoOkBQk3uM&tbnid=3ol_4KaFkO-WAM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECDsQAA..i&w=594&h=638&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECDsQAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fimages.lululemon.com%2Fis%2Fimage%2Flululemon%2FLW7AO6R_0001_1&imgrefurl=https%3A%2F%2Fshop.lululemon.com%2Fp%2Fwomen-shorts%2FSpeed-Up-Short-Reg-MD%2F_%2Fprod8800120&docid=aZU3NTFAH6RxRM&tbnid=8rcpmmQ4sCwOOM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECE4QAA..i&w=1800&h=2159&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECE4QAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fhips.hearstapps.com%2Fhmg-prod%2Fimages%2Fmhl-0416240152-copy-2-662bb162ea396.jpg%3Fcrop%3D0.502xw%3A1.00xh%3B0.250xw%2C0%26resize%3D1120%3A*&imgrefurl=https%3A%2F%2Fwww.menshealth.com%2Fstyle%2Fg28249026%2Fmost-flattering-shorts-for-men%2F&docid=VYLB4yKFy7h8XM&tbnid=ZK5L0zXnppC9CM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECF4QAA..i&w=962&h=958&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECF4QAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fwww.andoraeg.com%2Fcdn%2Fshop%2Fproducts%2F6221273217757_1of5.jpg%3Fv%3D1679363423%26width%3D300&imgrefurl=https%3A%2F%2Fwww.andoraeg.com%2Fcollections%2Fboys-short-1&docid=UthYcx3OHuAIhM&tbnid=pPnfembG2vfGsM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECGYQAA..i&w=300&h=300&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECGYQAA",
    "https://www.google.com/imgres?q=short%20images&imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1237985231%2Fphoto%2Fshorts.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DO-52YF684BxeC8EGHu9I68ujBzaPuukYnJrcjshmKb4%3D&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fshorts&docid=6MErxCfJZw-CwM&tbnid=hn9PkTYsJpbYVM&vet=12ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECBwQAA..i&w=612&h=408&hcb=2&ved=2ahUKEwjM6bj-3MeJAxVYUqQEHUjzIroQM3oECBwQAA",
];

const jacketImages = [
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Frukminim2.flixcart.com%2Fimage%2F850%2F1000%2Fxif0q%2Fjacket%2Fa%2Fc%2Fy%2Fm-no-slc-women-winter-jackets-slc-original-imags224bm6hpmvg.jpeg%3Fq%3D20%26crop%3Dfalse&imgrefurl=https%3A%2F%2Fwww.flipkart.com%2Fslc-full-sleeve-solid-women-jacket%2Fp%2Fitmfb0c4923ea267&docid=AgaPZYNCN7o4mM&tbnid=4TJ7tUCYtuBt_M&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oFCIMBEAA..i&w=850&h=996&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oFCIMBEAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=http%3A%2F%2Fdevotedstore.com%2Fcdn%2Fshop%2Ffiles%2F21.png%3Fv%3D1711236966&imgrefurl=https%3A%2F%2Fdevotedstore.com%2Fproducts%2Farmstrong&docid=f1pL5RRionqDpM&tbnid=bQOf4LsqdhI-2M&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFwQAA..i&w=1080&h=1080&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFwQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Feg.jumia.is%2Funsafe%2Ffit-in%2F500x500%2Ffilters%3Afill(white)%2Fproduct%2F62%2F221883%2F1.jpg%3F3755&imgrefurl=https%3A%2F%2Fwww.jumia.com.eg%2Ffashion-new-men-winter-jacket-men-ul-light-white-duck-down-jackets-38812226.html&docid=UkNUnRqlud6kpM&tbnid=y1RjgZ-H2kjsGM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFsQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFsQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-photo%2Fstill-life-rendering-jackets-display_23-2149745029.jpg&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fjackets&docid=3M8gRLtw_9-5JM&tbnid=UCCknSXc0LQA1M&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECHMQAA..i&w=626&h=417&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECHMQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fstatic.massimodutti.net%2Fassets%2Fpublic%2F2ed0%2F46f9%2F161a444f8bcd%2F197b20d147ca%2F02030276505-o7%2F02030276505-o7.jpg%3Fts%3D1726491463265&imgrefurl=https%3A%2F%2Fwww.massimodutti.com%2Feg%2Fen%2Fwool-blend-bomber-jacket-l02030276&docid=9fmhHgzuhfnc8M&tbnid=qcRofBdbJUDyoM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECHQQAA..i&w=2250&h=3000&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECHQQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fstatic.bershka.net%2Fassets%2Fpublic%2F847b%2F8ec4%2F359e4f778185%2F0b31ecb80706%2F06630551712-p%2F06630551712-p.jpg%3Fts%3D1722517701563%26w%3D800&imgrefurl=https%3A%2F%2Fwww.bershka.com%2Feg%2Fen%2Fpuffer-jacket-c0p162284619.html&docid=Tuc8Bt35Vs741M&tbnid=2jdM3lZyGtzbRM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECGgQAA..i&w=850&h=1090&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECGgQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fdfcdn.defacto.com.tr%2F376%2FC7537AX_24AU_NM39_01_02.jpg&imgrefurl=https%3A%2F%2Fwww.defacto.com%2Fen-eg%2Fman-denim-jacket&docid=RvtTvmb54FOS7M&tbnid=cU3_8UPWP1HzOM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECGQQAA..i&w=376&h=564&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECGQQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=http%3A%2F%2Ffabrilife.com%2Fproducts%2F6383785ce79eb-square.jpg&imgrefurl=https%3A%2F%2Ffabrilife.com%2Fproduct%2F72209-mens-premium-jacket-blizzard-navy&docid=94dhRMxudhottM&tbnid=HnCJsgIvmQEN7M&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oFCIEBEAA..i&w=1200&h=1200&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oFCIEBEAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fassets.ajio.com%2Fmedias%2Fsys_master%2Froot%2F20240502%2FgFYn%2F66336b1216fd2c6e6ae20570%2F-1117Wx1400H-466453554-black-MODEL.jpg&imgrefurl=https%3A%2F%2Fwww.ajio.com%2Fleather-retail-zip-front-jacket-with-insert-pockets%2Fp%2F466453554_black&docid=Zie1HIXtN2VgsM&tbnid=WtM6IZpSGi7hjM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFoQAA..i&w=1117&h=1400&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFoQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fthejacketmaker-images.s3.amazonaws.com%2FWomens%2520Leather%2520Jackets%2520-%2520%2520The%2520Jacket%2520Maker-1717164265811.webp&imgrefurl=https%3A%2F%2Fwww.thejacketmaker.com%2F&docid=0i6hrvzj85d99M&tbnid=oBLJvAszLKVPOM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECEUQAA..i&w=1400&h=1000&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECEUQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fmedia.alshaya.com%2Fadobe%2Fassets%2Furn%3Aaaid%3Aaem%3A3f054ef0-7d13-44b2-ae23-3b28cfb98456%2Fas%2FEID-cfc05cf450d0dd63cb2714dcb399ec5a1db2ae40.jpg%3Fwidth%3D450%26height%3D675%26preferwebp%3Dtrue&imgrefurl=https%3A%2F%2Feg.hm.com%2Fen%2Fshop-women%2Fshop-product%2Fjackets-coats%2Fdenim-jackets%2F&docid=B6PHWJrRpun9wM&tbnid=XqQCzhU-SzwDaM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFUQAA..i&w=450&h=675&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFUQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fimage.uniqlo.com%2FUQ%2FST3%2Fjp%2Fimagesother%2F000_PLP%2FCoreDown%2F24FW%2FWOMEN%2FLineupBanner-women-Seamless-sp.jpg&imgrefurl=https%3A%2F%2Fwww.uniqlo.com%2Fus%2Fen%2Fwomen%2Fouterwear-and-blazers%2Fdown-jackets-and-coats&docid=c6jZa1zbeuWN_M&tbnid=IvFpUV35iAafXM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFEQAA..i&w=750&h=1000&hcb=2&itg=1&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECFEQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fstatic.bershka.net%2F4%2Fphotos2%2F2024%2FV%2F0%2F2%2Fp%2F6666%2F644%2F250%2F6666644250_1_1_0.jpg%3Fimwidth%3D800%26ts%3D1704816938225&imgrefurl=https%3A%2F%2Fwww.bershka.com%2Feg%2Fen%2Flightweight-puffer-jacket-c0p165926178.html&docid=jFJqorn3UlQMUM&tbnid=rb4KZST8UIXSoM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECEYQAA..i&w=850&h=1090&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECEYQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fd1fufvy4xao6k9.cloudfront.net%2Fimages%2Fblog%2Fposts%2F2023%2F09%2Fhockerty_man_wearing_a_denim_jacket_6cb7140d_71e4_4306_8f95_2d248f73eac3.jpg&imgrefurl=https%3A%2F%2Fwww.hockerty.com%2Fen-us%2Fblog%2Ftypes-mens-coats&docid=zL9-OL_R_8vznM&tbnid=edeWVqzhO0p5KM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECCEQAA..i&w=1400&h=1400&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECCEQAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fhandsomedans.co.uk%2Fcdn%2Fshop%2Ffiles%2Fhd-anarchy-leather-jacket-670327.jpg%3Fv%3D1721599576%26width%3D1214&imgrefurl=https%3A%2F%2Fhandsomedans.co.uk%2Fproducts%2Fanarchy&docid=4rwu1dk1chxmQM&tbnid=jbWSLlfGh_3OoM&vet=12ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECB0QAA..i&w=613&h=800&hcb=2&ved=2ahUKEwjKtd2b3seJAxXqTqQEHSn_Hf8QM3oECB0QAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fmedia.centrepointstores.com%2Fi%2Fcentrepoint%2F3519994-HQ142610-SPWIN23240823_01-2100.jpg%3Ffmt%3Dauto%26%24quality-standard%24%26sm%3Dc%26%24prodimg-m-prt-pdp-2x%24&imgrefurl=https%3A%2F%2Fwww.splashfashions.com%2Fsa%2Fen%2FMen%2FClothing%2FCoats-%2526-Jackets%2FJackets%2FSPLASH-Solid-Bomber-Jacket-with-Zip-Closure-and-Pockets%2Fp%2F3519994&docid=NwZr6qHG_O8AxM&tbnid=zcP2jPYfJYzp3M&vet=12ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIURAA..i&w=832&h=1186&hcb=2&itg=1&ved=2ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIURAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fpictures.kartmax.in%2Flive%2Finside%2F800x800%2Fsites%2F7lcOi3kEBgRVHB0R5iIq%2Fproduct-images%2FM-641-23-NILE1.jpg&imgrefurl=https%3A%2F%2Fwww.octave.co.in%2Fproduct%2Fmettle-women-blue-knitted-jacket-1703238981&docid=ew2jGCQ-C572tM&tbnid=IuIXaPFH2ZAcXM&vet=12ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIcBAA..i&w=600&h=800&hcb=2&itg=1&ved=2ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIcBAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fd1fufvy4xao6k9.cloudfront.net%2Fimages%2Fblog%2Fposts%2F2023%2F09%2Fhockerty_man_wearing_leather_jacket_elegant_74ded09a_6c5a_4d55_9bd4_21adea675a10.jpg&imgrefurl=https%3A%2F%2Fwww.hockerty.com%2Fen-us%2Fblog%2Ftypes-mens-coats&docid=zL9-OL_R_8vznM&tbnid=SQoK3D0vBgd5_M&vet=12ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIThAA..i&w=1400&h=1400&hcb=2&ved=2ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIThAA",
    "https://www.google.com/imgres?q=jacket%20images&imgurl=https%3A%2F%2Fassets.thenorthface.com%2Fimages%2Ft_img%2Fc_pad%2Cb_white%2Cf_auto%2Ch_650%2Cw_555%2Ce_sharpen%3A70%2FNF0A831CECJ-HERO%2FWomens-Plus-HydrenaliteTM-Down-Hoodie-in-Amber-Green.png&imgrefurl=https%3A%2F%2Fwww.thenorthface.com%2Fen-us%2Fexplore%2Fwomens-puffers&docid=4UvdYP8LBrDEkM&tbnid=zPgQSix8WbqodM&vet=12ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIFRAA..i&w=555&h=650&hcb=2&ved=2ahUKEwiR2tPd3seJAxVwTqQEHZ9eBx44ChAzegQIFRAA",
];

const jacketsName = [
    "Leather Bomber Jacket",
    "Denim Trucker Jacket",
    "Waterproof Rain Jacket",
    "Puffer Jacket",
    "Faux Fur Coat",
    "Blazer Jacket",
    "Military Green Jacket",
    "Varsity Jacket",
    "Windbreaker Jacket",
    "Sherpa Fleece Jacket",
    "Chesterfield Coat",
    "Double-breasted Blazer",
    "Plaid Wool Jacket",
    "Biker Leather Jacket",
    "Peacoat Jacket",
    "Trench Coat",
    "Parka Jacket",
    "Corduroy Jacket",
    "Quilted Jacket",
    "Camo Jacket"
];

const shirtsName = [
    "Slim Fit Oxford Shirt",
    "Checkered Flannel Shirt",
    "Plain White Button-Down Shirt",
    "Casual V-neck T-Shirt",
    "Polo Shirt",
    "Henley Shirt",
    "Mandarin Collar Shirt",
    "Graphic Print T-Shirt",
    "Chambray Button-Up Shirt",
    "Tartan Check Shirt",
    "Light Linen Shirt",
    "Striped Dress Shirt",
    "Long Sleeve Denim Shirt",
    "Scoop Neck Top",
    "Slim Fit Button-Up Shirt",
    "Short Sleeve Hawaiian Shirt",
    "Turtleneck Shirt",
    "Slim Fit Turtleneck",
    "Plaid Flannel Shirt",
    "Relaxed Fit Crewneck"
];

const shortsName = [
    "Cargo Shorts",
    "Denim Cutoff Shorts",
    "Chino Shorts",
    "Board Shorts",
    "Bermuda Shorts",
    "Athletic Running Shorts",
    "High-Waisted Shorts",
    "Plaid Shorts",
    "Linen Summer Shorts",
    "Stretch Fit Shorts",
    "Skater Shorts",
    "Khaki Shorts",
    "Leather Shorts",
    "Loose Fit Shorts",
    "Vintage Style Shorts",
    "Graphic Print Shorts",
    "Drawstring Shorts",
    "Ripped Denim Shorts",
    "Biking Shorts",
    "Swim Trunks"
];

const dressesName = [
    "Maxi Dress",
    "A-line Dress",
    "Little Black Dress",
    "Bohemian Style Dress",
    "Bodycon Dress",
    "Midi Dress",
    "Off-Shoulder Dress",
    "Floral Print Dress",
    "Wrap Dress",
    "Shift Dress",
    "Pleated Dress",
    "Tulle Ball Gown",
    "Tea-Length Dress",
    "Sundress",
    "Empire Waist Dress",
    "Shift Dress",
    "Button-Down Shirt Dress",
    "Midi Skater Dress",
    "Sheath Dress",
    "Tunic Dress"
];

const shoesName = [
    "Chelsea Boots",
    "Classic Sneakers",
    "Running Shoes",
    "Loafers",
    "Leather Oxfords",
    "High-top Converse",
    "Slip-on Canvas Shoes",
    "Sandals",
    "Wedges",
    "Brogues",
    "Hiking Boots",
    "Ankle Strap Heels",
    "Dress Shoes",
    "Flip Flops",
    "Chunky Sneakers",
    "Clogs",
    "Mules",
    "Espadrilles",
    "Work Boots",
    "Platform Shoes"
];

const pantsName = [
    "Skinny Fit Jeans",
    "Wide Leg Trousers",
    "Chinos",
    "Cargo Pants",
    "Track Pants",
    "Bootcut Jeans",
    "Flared Pants",
    "Straight Leg Jeans",
    "Relaxed Fit Trousers",
    "Paperbag Waist Pants",
    "High-Waisted Pants",
    "Corduroy Trousers",
    "Joggers",
    "Leather Pants",
    "Tailored Trousers",
    "Denim Overalls",
    "Plaid Wool Pants",
    "Cropped Pants",
    "Cropped Wide-Leg Trousers",
    "Drawstring Sweatpants"
];

const generateRandomDate = async (product) => {
    const colours = await prisma.colour.findMany();
    const sizes = await prisma.size.findMany();
    const tags = await prisma.tag.findMany();

    const productSizes = sizes
        .filter(size => size.category_id === product.category_id)
        .filter(size => size.brand_id === product.brand_id);
    const sizeNum = faker.datatype.number({ min: 2, max: 5 });
    const Sizes = [];

    for (let i = 0; i < sizeNum; i++) {
        const size = faker.random.arrayElement(productSizes);
        if (!Sizes.includes(size)) {
            Sizes.push(size);
        }
    }

    for (const size of Sizes) {
        try {
            const productVariant = await prisma.productVariant.create({
                data: {
                    product_id: product.id,
                    size_id: size.id,
                    quantity: faker.datatype.number({ min: 1, max: 10 }),
                }
            });
            console.log(`Product Variant ${productVariant.id} created for Product ${product.id} with Size ${size.size} and Quantity ${productVariant.quantity}`);
        } catch (error) {
            console.log(`Product Variant already exists for Product ${product.id} with Size ${size.size}`);
            console.log(error);
        }

        const sizeTag = tags.find(tag => tag.name === size.size);
        try {
            await prisma.product_Tag.create({
                data: {
                    product_id: product.id,
                    tag_id: sizeTag.id,
                }
            });
        } catch (error) {
            console.log(`Product Tag already exists for Product ${product.id} with Tag ${sizeTag.name}`);
            console.log(error);
        }
        console.log(`Product Tag created for Product ${product.id} with Tag ${sizeTag.name}`);
    }

    const clrNum = faker.datatype.number({ min: 1, max: 4 });
    const clrFamilies = []
    const clrNames = [];
    const Clrs = faker.random.arrayElements(colours, clrNum);
    for (const clr of Clrs) {
        await prisma.product_Colour.create({
            data: {
                product_id: product.id,
                colour_id: clr.id,
            }
        });
        if (!clrFamilies.includes(clr.family)) {
            clrFamilies.push(clr.family);
        }
        if (!clrNames.includes(clr.name)) {
            clrNames.push(clr.name);
        }
        console.log(`Product Colour created for Product ${product.id} with Colour ${clr.name}`);
    }

    const uniqueClrTags = new Set();
    for (const clrFamily of clrFamilies) {
        const tagId = tags.find(tag => tag.name === clrFamily);
        uniqueClrTags.add(tagId);
    }
    for (const clrName of clrNames) {
        const tagId = tags.find(tag => tag.name === clrName);
        uniqueClrTags.add(tagId);
    }

    for (const tag of uniqueClrTags) {
        await prisma.product_Tag.create({
            data: {
                product_id: product.id,
                tag_id: tag.id,
            }
        });
        console.log(`Product Tag created for Product ${product.id} with Tag ID ${tag.name}`);
    }

    const materialTag = tags.find(tag => tag.name === product.material);
    if (materialTag) {
        await prisma.product_Tag.create({
            data: {
                product_id: product.id,
                tag_id: materialTag.id,
            }
        });
        console.log(`Product Tag created for Product ${product.id} with Tag ${materialTag.name}`);
    }
};

export const ProductSeed = async () => {
    try {
        const brands = await prisma.brand.findMany();
        const categories = await prisma.category.findMany();


        for (const brand of brands) {
            const shirtStyles = categories
                .filter(category => category.name === "Shirts")
            for (let i = 0; i < 10; i++) {
                const category = faker.random.arrayElement(shirtStyles);
                const product = await prisma.product.create({
                    data: {
                        name: faker.random.arrayElement(shirtsName),
                        price: faker.datatype.number({min: 200, max: 600}),
                        brand_id: brand.id,
                        discount: faker.datatype.number({min: 0, max: 20}),
                        rating: parseFloat(faker.datatype.number({min: 3.5, max: 5, precision: 0.1}).toFixed(1)),
                        material: faker.random.arrayElement(["cotton", "polyester", "silk", "linen", "denim"]),
                        returnPeriod: faker.datatype.number({min: 0, max: 14}),
                        image: faker.random.arrayElement(shirtImages),
                        category_id: category.id,
                    }
                });
                console.log(`Product ${product.id} created for Brand ${brand.id}`);

                const categoryNameTag = await prisma.tag.findFirst({where: {name: category.name}});
                const categoryStyleTag = await prisma.tag.findFirst({where: {name: category.style}});
                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryNameTag.id,
                    }
                });

                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryStyleTag.id,
                    }
                });

                await generateRandomDate(product);
            }

            const jacketStyles = categories
                .filter(category => category.name === "Jackets")
            for (let i = 0; i < 10; i++) {
                const category = faker.random.arrayElement(jacketStyles);
                const product = await prisma.product.create({
                    data: {
                        name: faker.random.arrayElement(jacketsName),
                        price: faker.datatype.number({ min: 600, max: 1200 }),
                        brand_id: brand.id,
                        discount: faker.datatype.number({ min: 0, max: 20 }),
                        rating: parseFloat(faker.datatype.number({ min: 3.5, max: 5, precision: 0.1 }).toFixed(1)),
                        material: faker.random.arrayElement(["Leather", "Denim", "Cotton", "Polyester", "Wool"]),
                        returnPeriod: faker.datatype.number({ min: 0, max: 14 }),
                        image: faker.random.arrayElement(jacketImages),
                        category_id: category.id,
                    }
                });
                console.log(`Product ${product.id} created for Brand ${brand.id}`);

                const categoryNameTag = await prisma.tag.findFirst({where: {name: category.name}});
                const categoryStyleTag = await prisma.tag.findFirst({where: {name: category.style}});
                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryNameTag.id,
                    }
                });

                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryStyleTag.id,
                    }
                });

                await generateRandomDate(product);
            }

            const shortStyles = categories
                .filter(category => category.name === "Shorts")
            for (let i = 0; i < 10; i++) {
                const category = faker.random.arrayElement(shortStyles);
                const product = await prisma.product.create({
                    data: {
                        name: faker.random.arrayElement(shortsName),
                        price: faker.datatype.number({ min: 300, max: 800 }),
                        brand_id: brand.id,
                        discount: faker.datatype.number({ min: 0, max: 20 }),
                        rating: parseFloat(faker.datatype.number({ min: 3.5, max: 5, precision: 0.1 }).toFixed(1)),
                        material: faker.random.arrayElement(["Cotton", "Polyester", "Denim", "Linen"]),
                        returnPeriod: faker.datatype.number({ min: 0, max: 14 }),
                        image: faker.random.arrayElement(shortsImages),
                        category_id: category.id,
                    }
                });
                console.log(`Product ${product.id} created for Brand ${brand.id}`);

                const categoryNameTag = await prisma.tag.findFirst({where: {name: category.name}});
                const categoryStyleTag = await prisma.tag.findFirst({where: {name: category.style}});
                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryNameTag.id,
                    }
                });

                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryStyleTag.id,
                    }
                });

                await generateRandomDate(product);
            }

            const dressStyles = categories
                .filter(category => category.name === "Dresses")
            for (let i = 0; i < 10; i++) {
                const category = faker.random.arrayElement(dressStyles);
                const product = await prisma.product.create({
                    data: {
                        name: faker.random.arrayElement(dressesName),
                        price: faker.datatype.number({ min: 500, max: 1200 }),
                        brand_id: brand.id,
                        discount: faker.datatype.number({ min: 0, max: 20 }),
                        rating: parseFloat(faker.datatype.number({ min: 3.5, max: 5, precision: 0.1 }).toFixed(1)),
                        material: faker.random.arrayElement(["Cotton", "Polyester", "Silk", "Linen"]),
                        returnPeriod: faker.datatype.number({ min: 0, max: 14 }),
                        image: faker.random.arrayElement(dressImages),
                        category_id: category.id,
                    }
                });
                console.log(`Product ${product.id} created for Brand ${brand.id}`);

                const categoryNameTag = await prisma.tag.findFirst({where: {name: category.name}});
                const categoryStyleTag = await prisma.tag.findFirst({where: {name: category.style}});
                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryNameTag.id,
                    }
                });

                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryStyleTag.id,
                    }
                });

                await generateRandomDate(product);
            }

            // const shoeStyles = categories
            //     .filter(category => category.name === "Shoes")
            //
            // for (let i = 0; i < 10; i++) {
            // const category = faker.random.arrayElement(shoeStyles);
            //     await prisma.product.create({
            //         data: {
            //             name: faker.random.arrayElement(shoesName),
            //             price: faker.datatype.number({ min: 400, max: 1000 }),
            //             brand_id: brand.id,
            //             discount: faker.datatype.number({ min: 0, max: 20 }),
            //             rating: parseFloat(faker.datatype.number({ min: 3.5, max: 5, precision: 0.1 }).toFixed(1)),
            //             material: faker.random.arrayElement(["Leather", "Canvas", "Rubber", "Suede"]),
            //             returnPeriod: faker.datatype.number({ min: 0, max: 14 }),
            //             image: faker.random.arrayElement(shoeImages),
            //             category_id: category.id,
            //         }
            //     });
            //
            //     console.log(`Product ${product.id} created for Brand ${brand.id}`);
            //
            //     const categoryNameTag = await prisma.tag.findFirst({where: {name: category.name}});
            //                 const categoryStyleTag = await prisma.tag.findFirst({where: {name: category.style}});
            //                 await prisma.product_Tag.create({
            //                     data: {
            //                         product_id: product.id,
            //                         tag_id: categoryNameTag.id,
            //                     }
            //                 });
            //
            //                 await prisma.product_Tag.create({
            //                     data: {
            //                         product_id: product.id,
            //                         tag_id: categoryStyleTag.id,
            //                     }
            //                 });
            // }

            const pantStyles = categories
                .filter(category => category.name === "Pants")
            for (let i = 0; i < 10; i++) {
                const category = faker.random.arrayElement(pantStyles);
                const product = await prisma.product.create({
                    data: {
                        name: faker.random.arrayElement(pantsName),
                        price: faker.datatype.number({min: 400, max: 1000}),
                        brand_id: brand.id,
                        discount: faker.datatype.number({min: 0, max: 20}),
                        rating: parseFloat(faker.datatype.number({min: 3.5, max: 5, precision: 0.1}).toFixed(1)),
                        material: faker.random.arrayElement(["Cotton", "Polyester", "Denim", "Linen"]),
                        returnPeriod: faker.datatype.number({min: 0, max: 14}),
                        image: faker.random.arrayElement(pantsImages),
                        category_id: category.id,
                    }
                });
                console.log(`Product ${product.id} created for Brand ${brand.id}`);

                const categoryNameTag = await prisma.tag.findFirst({where: {name: category.name}});
                const categoryStyleTag = await prisma.tag.findFirst({where: {name: category.style}});
                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryNameTag.id,
                    }
                });

                await prisma.product_Tag.create({
                    data: {
                        product_id: product.id,
                        tag_id: categoryStyleTag.id,
                    }
                });

                await generateRandomDate(product);
            }
        }
    } catch (error) {
        console.error(error);
    }
};