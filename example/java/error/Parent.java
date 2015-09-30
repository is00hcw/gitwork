
public abstract class Parent {
  Object a = new Object();
  Object b ;
  Parent(){
    b = new Object();
    System.out.println("a=" +a);
    init();  // 父类构造函数中，调用模板函数危险!! 子类的变量在函数执行时还没有初始化
  }
  
  abstract Object init() ;
  
  static class Child extends Parent{
    Object c = new Object();
    
    @Override
    Object init() {
      System.out.println("c=" + c);
      return null;
    }
  }
  
  public static void main(String[] args) {
    new Child();
  }
}
