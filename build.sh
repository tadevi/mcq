git clone https://github.com/tadevi/mcq
cd mcq/
git checkout frontend
cd mcq-frontend/
yarn install
cd ckeditor5-build-decoupled-document && yarn link
cd .. && yarn link "@ckeditor/ckeditor5-build-decoupled-document"
yarn build
